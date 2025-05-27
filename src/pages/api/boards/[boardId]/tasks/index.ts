import { withAuth } from "@lib/auth";
import { getNotionClientForUser } from '@lib/notion';


export const POST = withAuth(async (userId, context) => {
    const boardId = context.params.boardId!;


    const body = await context.request.json();
    const { name, description, dueDate } = body;

    if (!name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    try {
        const notion = await getNotionClientForUser(userId, context);
        const response = await notion.pages.create({
            parent: { database_id: boardId },
            properties: {
                Name: {
                    title: [{ text: { content: name } }],
                },
                Description: description
                    ? {
                        rich_text: [{ text: { content: description } }],
                    }
                    : undefined,
                DueDate: dueDate
                    ? {
                        date: { start: dueDate },
                    }
                    : undefined,
            },
        });

        return new Response(JSON.stringify(response), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create task' }), { status: 500 });
    }
});
