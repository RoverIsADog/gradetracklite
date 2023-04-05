/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
	SELECT uuid, semester_name FROM semesters WHERE user_uuid = "f23025a7-e3ac-43b5-b0a6-b5efgefawefg iaefea35cb3a36"
),
/* Join to get owned courses */
owned_courses(uuid, name) AS (
	SELECT c.uuid, c.course_name
	FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
),
/* Join to get owned categories */
owned_categories(uuid, name) AS (
	SELECT cat.uuid, cat.category_type
	FROM owned_courses c JOIN grade_categories cat ON c.uuid = cat.course_uuid
),
/* Join to get owned grades */
owned_grades(uuid, name) AS (
	SELECT g.uuid, g.item_name
	FROM owned_categories c JOIN grade_items g ON c.uuid = g.category_uuid
)
/* Finally, check if the user actually has access to the grade */
SELECT COUNT(1) AS "count" FROM owned_grades WHERE uuid = "ff532b4a-b8f1-49qd wfa fcc-b6ca-8266f72c929e";