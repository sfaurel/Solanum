import { Temporal } from 'temporal-polyfill';
import path from "path";
import { withAuth } from "@lib/auth";
import { getNotionClientForUser } from '@lib/notion';
import fs from "fs/promises";
const TTL_MINUTES = 5;


export const GET = withAuth(async (userId, context) => {
    const boardId = context.params.boardId;
    const CACHE_DIR = "./cache";
    const CACHE_FILE = path.join(CACHE_DIR, `${boardId}.json`);
    const now = Temporal.Now.instant();

    try {
        const stat = await fs.stat(CACHE_FILE);
        const modified = Temporal.Instant.fromEpochMilliseconds(Math.floor(stat.mtimeMs));

        if (now.since(modified).total({ unit: "minute" }) < TTL_MINUTES) {
            const raw = await fs.readFile(CACHE_FILE, "utf-8");
            return new Response(raw, {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (e) {
        console.error(`cache error: ${e}`)
    }

    try{
        const notion = await getNotionClientForUser(userId, context);
        const board = await notion.databases.retrieve({ database_id: boardId });

        const properties = board.properties;
        const field = {};
        
        for (const [key, property] of Object.entries(properties)) {
            const type = property.type;

            if (['select', 'multi_select'].includes(type)) {
                field[key] = {
                    type,
                    options: property[type].options.map((option) => ({
                        id: option.id,
                        name: option.name,
                        color: option.color
                    }))
                };
            }

            if (type === 'status') {
                const options = property.status.options;
                const groups = property.status.groups;

                const optionsById = Object.fromEntries(
                    options.map((options) => [options.id, {
                        id: options.id,
                        name: options.name,
                        color: options.color
                    }])
                );

                const grouped = groups.map((group) => ({
                    id: group.id,
                    name: group.name,
                    color: group.color,
                    options: group.option_ids.map((optionId) => optionsById[optionId])
                }));

                field[key] = {
                    type,
                    groups: grouped
                };
            }

            if (!['select', 'multi_select', 'status'].includes(type)) {
                field[key] = {
                    type
                };
            }
        }
        
        await fs.mkdir(CACHE_DIR, { recursive: true });
        await fs.writeFile(CACHE_FILE, JSON.stringify(field));

    
        return new Response(JSON.stringify(field), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            error: "Unable to fetch board properties",
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});





