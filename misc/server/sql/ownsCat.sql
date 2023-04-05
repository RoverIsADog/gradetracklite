/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
	SELECT uuid, semester_name FROM semesters WHERE user_uuid = "da30da01-091d-4058-9216-cc5fd35c558f"
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
)
/* Finally, check if the user actually has access to the category */
SELECT COUNT(1) AS "count" FROM owned_categories WHERE uuid = "2bac7dd3-a0bf-4b6a-9142-db8ce1b9cc35";