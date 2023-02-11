--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: marketplace_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO marketplace_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: marketplace_user
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: marketplace_user
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "ownerId" integer NOT NULL,
    total integer NOT NULL,
    status text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Order" OWNER TO marketplace_user;

--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_user
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Order_id_seq" OWNER TO marketplace_user;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_user
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Item; Type: TABLE; Schema: public; Owner: marketplace_user
--

CREATE TABLE public."Item" (
    id integer NOT NULL,
    "ownerId" integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    image text,
    price integer NOT NULL,
    tags text[],
    ratings integer[],
    "orderId" integer
);


ALTER TABLE public."Item" OWNER TO marketplace_user;

--
-- Name: Item_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_user
--

CREATE SEQUENCE public."Item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Item_id_seq" OWNER TO marketplace_user;

--
-- Name: Item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_user
--

ALTER SEQUENCE public."Item_id_seq" OWNED BY public."Item".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: marketplace_user
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL
);


ALTER TABLE public."User" OWNER TO marketplace_user;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: marketplace_user
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO marketplace_user;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marketplace_user
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: marketplace_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO marketplace_user;

--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: Item id; Type: DEFAULT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."Item" ALTER COLUMN id SET DEFAULT nextval('public."Item_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: marketplace_user
--



--
-- Data for Name: Item; Type: TABLE DATA; Schema: public; Owner: marketplace_user
--



--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: marketplace_user
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: marketplace_user
--

INSERT INTO public._prisma_migrations VALUES ('80698c83-8443-49ce-a6f5-fd1cba677da6', '23e22b50e887b105f98a1ca9ae40446f68793f4c7b8e4ac01f869540ae02f67c', '2023-02-08 22:46:40.89648+00', '20230208224640_init', NULL, NULL, '2023-02-08 22:46:40.85705+00', 1);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_user
--

SELECT pg_catalog.setval('public."Order_id_seq"', 1, false);


--
-- Name: Item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_user
--

SELECT pg_catalog.setval('public."Item_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marketplace_user
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Item Item_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: marketplace_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Order Order_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Item Item_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Item Item_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marketplace_user
--

ALTER TABLE ONLY public."Item"
    ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: marketplace_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--
