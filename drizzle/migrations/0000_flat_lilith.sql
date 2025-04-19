CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`author` text,
	`status` text,
	`createdAt` integer
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`bookId` text,
	`content` text,
	`createdAt` integer
);
