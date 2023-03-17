CREATE TABLE tt_session (
  sid varchar NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL,
  CONSTRAINT pk_tt_session PRIMARY KEY (sid)
  	NOT DEFERRABLE
)
WITH (OIDS=FALSE);

CREATE TABLE mt_user (
  user_id VARCHAR(36) NOT NULL,
  user_email VARCHAR(256),
  user_name VARCHAR(64) NOT NULL,
  comment VARCHAR(1000),
  update_time TIMESTAMP NOT NULL,
  CONSTRAINT pk_mt_user PRIMARY KEY (user_id),
  CONSTRAINT ux_mt_user_01 UNIQUE (user_email)
);

CREATE TABLE mt_user_password (
  user_id VARCHAR(36) NOT NULL,
  user_password VARCHAR(1000) NOT NULL,
  CONSTRAINT pk_mt_user_password PRIMARY KEY (user_id)
);

CREATE TABLE mt_user_role (
  user_id VARCHAR(36) NOT NULL,
  role_cd VARCHAR(10) NOT NULL,
  CONSTRAINT pk_mt_user_role PRIMARY KEY (user_id, role_cd)
);
