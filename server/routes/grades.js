// grades.js
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

module.exports = (app, db) =>  {
    // /add-category POST request
    app.post('/add-category', async (req, res) => {
        // Get request body
        const { courseUuid, categoryType, categoryWeight, categoryDescription } = req.body;

        // Check if request body contains the required fields
        if (!courseUuid || !categoryType || !categoryWeight) {
            res.status(400).json({
                error: -2,
                message: 'Missing required fields'
            });
            return;
        }
        
        // Get JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                error: 6,
                message: 'Invalid or missing token'
            });
            return;
        }
        
        // Decode the JWT token
        const token = authHeader.split(' ')[1];
        let decodedToken;
        
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'not_having_a_secret_key_is_bad_bad_bad_smh');
        } catch (err) {
            // Check if token is expired
            try {
                const { exp } = jwt.decode(token);
                if (exp * 1000 < Date.now()) {
                    res.status(401).json({
                        error: 9,
                        message: 'Expired token'
                    });
                    return;
                }
            } catch (err) {
                res.status(401).json({
                    error: 7,
                    message: 'Invalid or missing token'
                });
                return;
            }
            res.status(401).json({
                error: 7,
                message: 'Invalid or missing token'
            });
            return;
        }
        
        // Get the user's UUID from the JWT token
        if (!decodedToken || !decodedToken.uuid) {
            res.status(401).json({
                error: 8,
                message: 'Invalid or missing token'
            });
            return;
        }
        
        const userUuid = decodedToken.uuid;
        
        // Check that user exists
        db.get('SELECT * FROM users WHERE uuid = ?',
            [userUuid],
            (err, userRow) => {
                if (err) {
                    console.error('Error selecting user:', err);
                    res.status(500).json({
                        error: -1,
                        message: 'Internal server error'
                    });
                    return;
                }
                
                if (!userRow) {
                    res.json({
                        error: 1,
                        message: 'User does not exist'
                    });
                    return;
                }
                
                // Check that course exists
                db.get('SELECT * FROM courses WHERE uuid = ?',
                    [courseUuid],
                    (err, courseRow) => {
                        if (err) {
                            console.error('Error selecting course:', err);
                            res.status(500).json({
                                error: -1,
                                message: 'Internal server error'
                            });
                            return;
                        }
                        
                        if (!courseRow) {
                            res.json({
                                error: 2,
                                message: 'Course does not exist'
                            });
                            return;
                        }
                        
                        // Check that semester exists
                        db.get('SELECT * FROM semesters WHERE uuid = ?',
                            [courseRow.semester_uuid],
                            (err, semesterRow) => {
                                if (err) {
                                    console.error('Error selecting semester:', err);
                                    res.status(500).json({
                                        error: -1,
                                        message: 'Internal server error'
                                    });
                                    return;
                                }
                                
                                if (!semesterRow) {
                                    res.json({
                                        error: 3,
                                        message: 'Semester does not exist'
                                    });
                                    return;
                                }
                                
                                // Check that user is authorized to access the specified semester
                                if (semesterRow.user_uuid !== userUuid) {
                                    res.json({
                                        error: 4,
                                        message: 'User does not have authorized access to the specified semester'
                                    });
                                    return;
                                }
                                
                                // Check that grade category does not already exist
                                db.get('SELECT * FROM grade_categories WHERE course_uuid = ? AND category_type = ?',
                                    [courseUuid, categoryType],
                                    (err, categoryRow) => {
                                        if (err) {
                                            console.error('Error selecting category:', err);
                                            res.status(500).json({
                                                error: -1,
                                                message: 'Internal server error'
                                            });
                                            return;
                                        }
                                        
                                        if (categoryRow) {
                                            res.json({
                                                error: 5,
                                                message: 'Grade category already exists'
                                            });
                                            return;
                                        }
                                        
                                        // SQL query
                                        db.run(
                                            'INSERT INTO grade_categories (uuid, course_uuid, category_type, category_weight, category_description) VALUES (?, ?, ?, ?, ?)',
                                            [uuidv4(), courseUuid, categoryType, categoryWeight, categoryDescription || 'No Description.'],
                                            (err) => {
                                                if (err) {
                                                    console.error('Error inserting grade category:', err);
                                                    res.status(500).json({
                                                        error: -1,
                                                        message: 'Internal server error'
                                                    });
                                                    return;
                                                } else {
                                                    res.status(200).json({
                                                        error: 0,
                                                        message: 'Grade category created successfully'
                                                    });
                                                }
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
    
    // /add-grade POST request
    app.post('/add-grade', async (req, res) => {
        // Get request body
        const { categoryUuid, itemName, itemWeight, itemMark, itemTotal, itemDescription, itemDate } = req.body;
        
        // Check if request body contains the required fields
        if (!categoryUuid || !itemName || !itemWeight || !itemMark || !itemTotal || !itemDate) {
            res.status(400).json({
                error: -2,
                message: 'Missing required fields'
            });
            return;
        }
        
        // Get JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                error: 7,
                message: 'Invalid or missing token'
            });
            return;
        }
        
        // Decode the JWT token
        const token = authHeader.split(' ')[1];
        let decodedToken;
        
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'not_having_a_secret_key_is_bad_bad_bad_smh');
        } catch (err) {
            // Check if token is expired
            try {
                const { exp } = jwt.decode(token);
                if (exp * 1000 < Date.now()) {
                    res.status(401).json({
                        error: 10,
                        message: 'Expired token'
                    });
                    return;
                }
            } catch (err) {
                res.status(401).json({
                    error: 8,
                    message: 'Invalid or missing token'
                });
                return;
            }
            res.status(401).json({
                error: 8,
                message: 'Invalid or missing token'
            });
            return;
        }
        
        // Get the user's UUID from the JWT token
        if (!decodedToken || !decodedToken.uuid) {
            res.status(401).json({
                error: 9,
                message: 'Invalid or missing token'
            });
            return;
        }
        
        const userUuid = decodedToken.uuid;
        
        // Check that user exists
        db.get('SELECT * FROM users WHERE uuid = ?', [userUuid], async (err, userRow) => {
            if (err) {
                console.error('Error selecting user:', err);
                res.status(500).json({
                    error: -1,
                    message: 'Internal server error'
                });
                return;
            }
            
            if (!userRow) {
                res.json({
                    error: 1,
                    message: 'User does not exist'
                });
                return;
            }
            
            // Check that grade category exists
            db.get('SELECT * FROM grade_categories WHERE uuid = ?',
                [categoryUuid],
                (err, categoryRow) => {
                    if (err) {
                        console.error('Error selecting grade category:', err);
                        res.status(500).json({
                            error: -1,
                            message: 'Internal server error'
                        });
                        return;
                    }
                    
                    if (!categoryRow) {
                        res.json({
                            error: 2,
                            message: 'Grade category does not exist'
                        });
                        return;
                    }
                    
                    // Check that course exists
                    db.get('SELECT * FROM courses WHERE uuid = ?',
                        [categoryRow.course_uuid],
                        (err, courseRow) => {
                            if (err) {
                                console.error('Error selecting course:', err);
                                res.status(500).json({
                                    error: -1,
                                    message: 'Internal server error'
                                });
                                return;
                            }
                            
                            if (!courseRow) {
                                res.json({
                                    error: 3,
                                    message: 'Course does not exist'
                                });
                                return;
                            }
                            
                            // Check that semester exists
                            db.get('SELECT * FROM semesters WHERE uuid =?',
                                [courseRow.semester_uuid],
                                (err, semesterRow) => {
                                    if (err) {
                                        console.error('Error selecting semester:', err);
                                        res.status(500).json({
                                            error: -1,
                                            message: 'Internal server error'
                                        });
                                        return;
                                    }
                                    
                                    if (!semesterRow) {
                                        res.json({
                                            error: 4,
                                            message: 'Semester does not exist'
                                        });
                                        return;
                                    }
                                    
                                    // Check that user is authorized to access the specified semester
                                    if (semesterRow.user_uuid !== userUuid) {
                                        res.json({
                                            error: 5,
                                            message: 'User does not have authorized access to the specified semester'
                                        });
                                        return;
                                    }
                                    
                                    // Check that grade item does not already exist
                                    db.get('SELECT * FROM grade_items WHERE category_uuid = ? AND item_name = ?',
                                        [categoryUuid, itemName],
                                        (err, itemRow) => {
                                            if (err) {
                                                console.error('Error selecting grade item:', err);
                                                res.status(500).json({
                                                    error: -1,
                                                    message: 'Internal server error'
                                                });
                                                return;
                                            }
                                            
                                            if (itemRow) {
                                                res.json({
                                                    error: 6,
                                                    message: 'Grade item already exists'
                                                });
                                                return;
                                            }
                                            
                                            // SQL query
                                            db.run(
                                                'INSERT INTO grade_items (uuid, category_uuid, item_name, item_weight, item_mark, item_total, item_description, item_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                                [uuidv4(), categoryUuid, itemName, itemWeight, itemMark, itemTotal, itemDescription || 'No Description.', itemDate],
                                                (err) => {
                                                    if (err) {
                                                        console.error('Error inserting grade item:', err);
                                                        res.status(500).json({
                                                            error: -1,
                                                            message: 'Internal server error'
                                                        });
                                                        return;
                                                    } else {
                                                        res.status(200).json({
                                                            error: 0,
                                                            message: 'Grade item created successfully'
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        });
    });
};
