import { pgTable, text, timestamp, boolean, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description').notNull(),
    website: text('website').notNull(),
    category: text('category').notNull(),
    publishedAt: timestamp('published_at').notNull(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    logoUrl: text('logo_url'),
    repoUrl: text('repo_url'),
    isOpenSource: boolean('is_open_source').notNull().default(true),
}, (table) => {
    return [
        uniqueIndex('project_slug_idx').on(table.slug),
    ];
});

export const llmsDocuments = pgTable('llms_documents', {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id).notNull(),
    urlType: text('url_type')
        .notNull()
        .$type<'standard' | 'full'>()
        .default('standard'),
    urlValue: text('url_value').notNull(),
    contentHash: text('content_hash').notNull(),
    content: text('content').notNull(),
    fetchedAt: timestamp('fetched_at').notNull().defaultNow(),
}, (table) => {
    return [
        uniqueIndex('llms_hash_idx').on(table.contentHash, table.projectId),
    ];
});

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});
