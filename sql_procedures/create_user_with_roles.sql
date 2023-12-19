CREATE OR REPLACE FUNCTION "nestjs-template".create_user_with_roles(
    in_email TEXT,
    in_username TEXT,
    in_password TEXT,
    in_statusid INTEGER,
    in_defaultauthproviderid INTEGER,
    in_createdat TIMESTAMP,
    in_roles JSON[]
) RETURNS JSON AS $$

DECLARE
    user_id TEXT;
    user_obj JSON;
BEGIN
    -- Install uuid-ossp extension if not already installed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Generate UUID using the uuid-ossp extension
    user_id := uuid_generate_v4();

    -- Insert user into the 'users' table with updatedAt set to the current timestamp
    INSERT INTO "nestjs-template"."users"(
        id, email, username, password,
        "statusId", "defaultAuthProviderId", "createdAt", "updatedAt"
    )
    VALUES (
        user_id, in_email, in_username, in_password,
        in_statusid, in_defaultauthproviderid, in_createdat, CURRENT_TIMESTAMP
    )
    RETURNING id INTO user_id;

    -- Insert roles into the 'user_roles' table
    FOR i IN 1..array_length(in_roles, 1) LOOP
        INSERT INTO "nestjs-template"."user_roles"("userId", "roleId")
        VALUES (user_id, (in_roles[i]->'role'->>'id')::INTEGER);
    END LOOP;

    -- Construct the user object with roles
    SELECT json_build_object(
        'id', user_id,
        'email', in_email,
        'username', in_username,
        'roles', (
            SELECT json_agg(
                json_build_object(
                    'role', json_build_object(
                        'id', r.id,
                        'name', r.name,
                        'description', r.description,
                        'active', r.active
                    )
                )
            )
            FROM "nestjs-template"."roles" r
            JOIN "nestjs-template"."user_roles" ur ON r.id = ur."roleId"
            WHERE ur."userId" = user_id
        )
    ) INTO user_obj;

    -- Return the user object
    RETURN user_obj;
END;

$$ LANGUAGE plpgsql;
