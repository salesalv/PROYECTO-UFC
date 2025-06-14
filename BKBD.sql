PGDMP                      }            postgres    17.5    17.5 A    =           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            >           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            @           1262    5    postgres    DATABASE        CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Argentina.1252';
    DROP DATABASE postgres;
                     postgres    false            A           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                        postgres    false    4928            �            1259    16401    division    TABLE     f   CREATE TABLE public.division (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);
    DROP TABLE public.division;
       public         heap r       postgres    false            �            1259    16400    division_id_seq    SEQUENCE     �   CREATE SEQUENCE public.division_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.division_id_seq;
       public               postgres    false    220            B           0    0    division_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.division_id_seq OWNED BY public.division.id;
          public               postgres    false    219            �            1259    16420    evento    TABLE       CREATE TABLE public.evento (
    id integer NOT NULL,
    titulo character varying(100),
    fecha date,
    ubicacion character varying(100),
    sede character varying(100),
    imagen character varying(255),
    texto_alternativo character varying(255)
);
    DROP TABLE public.evento;
       public         heap r       postgres    false            �            1259    16419    evento_id_seq    SEQUENCE     �   CREATE SEQUENCE public.evento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.evento_id_seq;
       public               postgres    false    224            C           0    0    evento_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.evento_id_seq OWNED BY public.evento.id;
          public               postgres    false    223            �            1259    16429    pelea    TABLE     �   CREATE TABLE public.pelea (
    id integer NOT NULL,
    evento_id integer,
    peleador1_id integer,
    peleador2_id integer,
    pelea_principal boolean DEFAULT false,
    pelea_coestelar boolean DEFAULT false,
    rounds integer
);
    DROP TABLE public.pelea;
       public         heap r       postgres    false            �            1259    16428    pelea_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pelea_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.pelea_id_seq;
       public               postgres    false    226            D           0    0    pelea_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.pelea_id_seq OWNED BY public.pelea.id;
          public               postgres    false    225            �            1259    16408    peleador    TABLE     �   CREATE TABLE public.peleador (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    record character varying(50),
    puntos integer,
    estado character varying(50),
    rango integer,
    division_id integer
);
    DROP TABLE public.peleador;
       public         heap r       postgres    false            �            1259    16407    peleador_id_seq    SEQUENCE     �   CREATE SEQUENCE public.peleador_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.peleador_id_seq;
       public               postgres    false    222            E           0    0    peleador_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.peleador_id_seq OWNED BY public.peleador.id;
          public               postgres    false    221            �            1259    16453 
   prediccion    TABLE     �  CREATE TABLE public.prediccion (
    id integer NOT NULL,
    usuario_id integer,
    pelea_id integer,
    ganador_id integer,
    metodo character varying(50),
    round character varying(10),
    primer_golpe_id integer,
    primer_takedown_id integer,
    sera_ko boolean,
    sera_sumision boolean,
    ira_a_decision boolean,
    mas_golpes_significativos_id integer,
    apuesta integer,
    ganancia_potencial integer,
    resultado character varying(50)
);
    DROP TABLE public.prediccion;
       public         heap r       postgres    false            �            1259    16452    prediccion_id_seq    SEQUENCE     �   CREATE SEQUENCE public.prediccion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.prediccion_id_seq;
       public               postgres    false    228            F           0    0    prediccion_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.prediccion_id_seq OWNED BY public.prediccion.id;
          public               postgres    false    227            �            1259    16490    ranking_global    TABLE     �   CREATE TABLE public.ranking_global (
    id integer NOT NULL,
    usuario_id integer,
    puntos integer DEFAULT 0,
    racha integer DEFAULT 0
);
 "   DROP TABLE public.ranking_global;
       public         heap r       postgres    false            �            1259    16489    ranking_global_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ranking_global_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.ranking_global_id_seq;
       public               postgres    false    230            G           0    0    ranking_global_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.ranking_global_id_seq OWNED BY public.ranking_global.id;
          public               postgres    false    229            �            1259    16389    usuario    TABLE     �  CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    correo character varying(100) NOT NULL,
    fecha_registro date NOT NULL,
    puntos integer DEFAULT 0,
    rango character varying(50),
    avatar character varying(255),
    notificaciones boolean DEFAULT true,
    tema character varying(20),
    "contraseña" character varying(100) NOT NULL,
    saldo integer DEFAULT 0
);
    DROP TABLE public.usuario;
       public         heap r       postgres    false            �            1259    16388    usuario_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.usuario_id_seq;
       public               postgres    false    218            H           0    0    usuario_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;
          public               postgres    false    217            y           2604    16404    division id    DEFAULT     j   ALTER TABLE ONLY public.division ALTER COLUMN id SET DEFAULT nextval('public.division_id_seq'::regclass);
 :   ALTER TABLE public.division ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            {           2604    16423 	   evento id    DEFAULT     f   ALTER TABLE ONLY public.evento ALTER COLUMN id SET DEFAULT nextval('public.evento_id_seq'::regclass);
 8   ALTER TABLE public.evento ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            |           2604    16432    pelea id    DEFAULT     d   ALTER TABLE ONLY public.pelea ALTER COLUMN id SET DEFAULT nextval('public.pelea_id_seq'::regclass);
 7   ALTER TABLE public.pelea ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            z           2604    16411    peleador id    DEFAULT     j   ALTER TABLE ONLY public.peleador ALTER COLUMN id SET DEFAULT nextval('public.peleador_id_seq'::regclass);
 :   ALTER TABLE public.peleador ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222                       2604    16456    prediccion id    DEFAULT     n   ALTER TABLE ONLY public.prediccion ALTER COLUMN id SET DEFAULT nextval('public.prediccion_id_seq'::regclass);
 <   ALTER TABLE public.prediccion ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    228    228            �           2604    16493    ranking_global id    DEFAULT     v   ALTER TABLE ONLY public.ranking_global ALTER COLUMN id SET DEFAULT nextval('public.ranking_global_id_seq'::regclass);
 @   ALTER TABLE public.ranking_global ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229    230            u           2604    16392 
   usuario id    DEFAULT     h   ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);
 9   ALTER TABLE public.usuario ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            0          0    16401    division 
   TABLE DATA           .   COPY public.division (id, nombre) FROM stdin;
    public               postgres    false    220   �O       4          0    16420    evento 
   TABLE DATA           _   COPY public.evento (id, titulo, fecha, ubicacion, sede, imagen, texto_alternativo) FROM stdin;
    public               postgres    false    224   �O       6          0    16429    pelea 
   TABLE DATA           t   COPY public.pelea (id, evento_id, peleador1_id, peleador2_id, pelea_principal, pelea_coestelar, rounds) FROM stdin;
    public               postgres    false    226   �O       2          0    16408    peleador 
   TABLE DATA           Z   COPY public.peleador (id, nombre, record, puntos, estado, rango, division_id) FROM stdin;
    public               postgres    false    222   �O       8          0    16453 
   prediccion 
   TABLE DATA           �   COPY public.prediccion (id, usuario_id, pelea_id, ganador_id, metodo, round, primer_golpe_id, primer_takedown_id, sera_ko, sera_sumision, ira_a_decision, mas_golpes_significativos_id, apuesta, ganancia_potencial, resultado) FROM stdin;
    public               postgres    false    228   �O       :          0    16490    ranking_global 
   TABLE DATA           G   COPY public.ranking_global (id, usuario_id, puntos, racha) FROM stdin;
    public               postgres    false    230   P       .          0    16389    usuario 
   TABLE DATA           �   COPY public.usuario (id, nombre_usuario, correo, fecha_registro, puntos, rango, avatar, notificaciones, tema, "contraseña", saldo) FROM stdin;
    public               postgres    false    218   5P       I           0    0    division_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.division_id_seq', 1, false);
          public               postgres    false    219            J           0    0    evento_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.evento_id_seq', 1, false);
          public               postgres    false    223            K           0    0    pelea_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.pelea_id_seq', 1, false);
          public               postgres    false    225            L           0    0    peleador_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.peleador_id_seq', 1, false);
          public               postgres    false    221            M           0    0    prediccion_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.prediccion_id_seq', 1, false);
          public               postgres    false    227            N           0    0    ranking_global_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.ranking_global_id_seq', 1, false);
          public               postgres    false    229            O           0    0    usuario_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.usuario_id_seq', 1, false);
          public               postgres    false    217            �           2606    16406    division division_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.division
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.division DROP CONSTRAINT division_pkey;
       public                 postgres    false    220            �           2606    16427    evento evento_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.evento
    ADD CONSTRAINT evento_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.evento DROP CONSTRAINT evento_pkey;
       public                 postgres    false    224            �           2606    16436    pelea pelea_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.pelea
    ADD CONSTRAINT pelea_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.pelea DROP CONSTRAINT pelea_pkey;
       public                 postgres    false    226            �           2606    16413    peleador peleador_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.peleador
    ADD CONSTRAINT peleador_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.peleador DROP CONSTRAINT peleador_pkey;
       public                 postgres    false    222            �           2606    16458    prediccion prediccion_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.prediccion
    ADD CONSTRAINT prediccion_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.prediccion DROP CONSTRAINT prediccion_pkey;
       public                 postgres    false    228            �           2606    16497 "   ranking_global ranking_global_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.ranking_global
    ADD CONSTRAINT ranking_global_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.ranking_global DROP CONSTRAINT ranking_global_pkey;
       public                 postgres    false    230            �           2606    16399    usuario usuario_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.usuario DROP CONSTRAINT usuario_pkey;
       public                 postgres    false    218            �           2606    16437    pelea pelea_evento_id_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.pelea
    ADD CONSTRAINT pelea_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.evento(id);
 D   ALTER TABLE ONLY public.pelea DROP CONSTRAINT pelea_evento_id_fkey;
       public               postgres    false    4746    224    226            �           2606    16442    pelea pelea_peleador1_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pelea
    ADD CONSTRAINT pelea_peleador1_id_fkey FOREIGN KEY (peleador1_id) REFERENCES public.peleador(id);
 G   ALTER TABLE ONLY public.pelea DROP CONSTRAINT pelea_peleador1_id_fkey;
       public               postgres    false    222    4744    226            �           2606    16447    pelea pelea_peleador2_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pelea
    ADD CONSTRAINT pelea_peleador2_id_fkey FOREIGN KEY (peleador2_id) REFERENCES public.peleador(id);
 G   ALTER TABLE ONLY public.pelea DROP CONSTRAINT pelea_peleador2_id_fkey;
       public               postgres    false    4744    226    222            �           2606    16414 "   peleador peleador_division_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.peleador
    ADD CONSTRAINT peleador_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.division(id);
 L   ALTER TABLE ONLY public.peleador DROP CONSTRAINT peleador_division_id_fkey;
       public               postgres    false    4742    222    220            �           2606    16469 %   prediccion prediccion_ganador_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prediccion
    ADD CONSTRAINT prediccion_ganador_id_fkey FOREIGN KEY (ganador_id) REFERENCES public.peleador(id);
 O   ALTER TABLE ONLY public.prediccion DROP CONSTRAINT prediccion_ganador_id_fkey;
       public               postgres    false    228    222    4744            �           2606    16484 7   prediccion prediccion_mas_golpes_significativos_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prediccion
    ADD CONSTRAINT prediccion_mas_golpes_significativos_id_fkey FOREIGN KEY (mas_golpes_significativos_id) REFERENCES public.peleador(id);
 a   ALTER TABLE ONLY public.prediccion DROP CONSTRAINT prediccion_mas_golpes_significativos_id_fkey;
       public               postgres    false    228    4744    222            �           2606    16464 #   prediccion prediccion_pelea_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prediccion
    ADD CONSTRAINT prediccion_pelea_id_fkey FOREIGN KEY (pelea_id) REFERENCES public.pelea(id);
 M   ALTER TABLE ONLY public.prediccion DROP CONSTRAINT prediccion_pelea_id_fkey;
       public               postgres    false    226    228    4748            �           2606    16474 *   prediccion prediccion_primer_golpe_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prediccion
    ADD CONSTRAINT prediccion_primer_golpe_id_fkey FOREIGN KEY (primer_golpe_id) REFERENCES public.peleador(id);
 T   ALTER TABLE ONLY public.prediccion DROP CONSTRAINT prediccion_primer_golpe_id_fkey;
       public               postgres    false    4744    228    222            �           2606    16479 -   prediccion prediccion_primer_takedown_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prediccion
    ADD CONSTRAINT prediccion_primer_takedown_id_fkey FOREIGN KEY (primer_takedown_id) REFERENCES public.peleador(id);
 W   ALTER TABLE ONLY public.prediccion DROP CONSTRAINT prediccion_primer_takedown_id_fkey;
       public               postgres    false    222    4744    228            �           2606    16459 %   prediccion prediccion_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prediccion
    ADD CONSTRAINT prediccion_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);
 O   ALTER TABLE ONLY public.prediccion DROP CONSTRAINT prediccion_usuario_id_fkey;
       public               postgres    false    228    218    4740            �           2606    16498 -   ranking_global ranking_global_usuario_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.ranking_global
    ADD CONSTRAINT ranking_global_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id);
 W   ALTER TABLE ONLY public.ranking_global DROP CONSTRAINT ranking_global_usuario_id_fkey;
       public               postgres    false    230    4740    218            0      x������ � �      4      x������ � �      6      x������ � �      2      x������ � �      8      x������ � �      :      x������ � �      .      x������ � �     