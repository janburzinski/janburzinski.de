import { getBlogPost } from '$lib/blog.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const post = await getBlogPost(params.slug);
	
	if (!post) {
		throw error(404, 'Blog post not found');
	}
	
	return {
		post
	};
};