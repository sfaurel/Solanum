import { withAuth } from '@lib/auth';
import { getNotionClientForUser } from '@lib/notion';

export const GET = withAuth(async (userId, context) => {
    
    try {
        const notion = await getNotionClientForUser(userId, context);

        const response = await notion.search({
            filter: { property: "object", value: "database" },
            sort: { direction: "descending", timestamp: "last_edited_time" },
            page_size: 10,
        });

        const boards = response.results

        return new Response(JSON.stringify(boards), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            error: "Unable to fetch Notion boards for the current user",
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});
