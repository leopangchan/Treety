DROP TABLE pedestrian;
DROP TABLE tree;

CREATE TABLE pedestrian
(
    id integer NOT NULL,
    count bigint,
    local_id character varying(255) COLLATE pg_catalog."default",
    "time" bigint,
    CONSTRAINT pedestrian_pkey PRIMARY KEY (id)
);

CREATE TABLE tree
(
    id integer NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    type character varying(255) COLLATE pg_catalog."default",
    x_coord double precision,
    y_coord double precision,
    CONSTRAINT tree_pkey PRIMARY KEY (id)
)