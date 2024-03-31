-- CreateTable
CREATE TABLE "Rsvp" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);
