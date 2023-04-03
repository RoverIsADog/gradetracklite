/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
	SELECT uuid, semester_name FROM semesters WHERE user_uuid = "da30da01-091d-4058-9216-cc5fd35c558f"
),
/* Join to get owned courses */
owned_courses(uuid, name) AS (
	SELECT c.uuid, c.course_name
	FROM owned_semesters s JOIN courses c ON s.uuid = c.semester_uuid
)
/* Finally, check if the user actually has access to the course */
SELECT COUNT(1) AS "count" FROM owned_courses WHERE uuid = "2323fe70-d91b-418d-a899-733dc92f9037";