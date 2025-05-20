
import { withAuth } from "@lib/auth";
import { getNotionClientForUser } from '@lib/notion';

export const GET = withAuth(async (userId, context) => {
    const boardId = context.params.boardId;

    try{
        const url = new URL(`/api/boards/${boardId}/properties`, context.request.url);
        const response = await fetch(url.toString(),{
            headers: {
                'cookie': context.request.headers.get('cookie') || '',
                'authorization': context.request.headers.get('authorization') || ''
            }
        });

        const properties = await response.json();

        const notion = await getNotionClientForUser(userId, context);
        const board = await notion.databases.query({
            database_id: boardId,
        })

        const tasks = board.results;
        
        const result = [];
        for (const group of properties.Status.groups) {
            const groupObj = {
                group: group.name,
                options: []
            };

            for (const option of group.options) {
                const optionTasks = tasks.filter(
                    task => task.properties.Status.status?.id === option.id
                );

                groupObj.options.push({
                    option: option.name,
                    tasks: optionTasks
                });
            }

            result.push(groupObj);
        }

        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({
            error: "Unable to fetch board",
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }
    );
    }
});