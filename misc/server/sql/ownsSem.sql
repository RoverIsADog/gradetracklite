/* Get all owned semesters */
WITH owned_semesters(uuid, name) AS (
	SELECT uuid, semester_name FROM semesters WHERE user_uuid = "da30da01-091d-4058-9216-cc5fd35c558f"
)
/* Finally, check if the user actually has access to the semester */
SELECT COUNT(1) AS "count" FROM owned_semesters WHERE uuid = "d34ea66b-b163-4bf8-b02f-de1a720d0f25";