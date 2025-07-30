import type { ComponentType } from 'svelte';

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	content?: ComponentType;
}

export interface BlogPostModule {
	metadata: {
		title: string;
		date: string;
		excerpt: string;
		tags: string[];
		slug: string;
	};
	default: any;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
	const modules = import.meta.glob('/src/content/blog/*.mdx') as Record<string, () => Promise<BlogPostModule>>;

	const posts: BlogPost[] = [];

	for (const path in modules) {
		const module = await modules[path]();
		const slug = path.split('/').pop()?.replace('.mdx', '') || '';

		posts.push({
			slug,
			title: module.metadata.title,
			date: module.metadata.date,
			excerpt: module.metadata.excerpt,
			tags: module.metadata.tags
		});
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
	try {
		const module = await import(`../content/blog/${slug}.mdx`) as BlogPostModule;

		return {
			slug,
			title: module.metadata.title,
			date: module.metadata.date,
			excerpt: module.metadata.excerpt,
			tags: module.metadata.tags,
			content: module.default
		};
	} catch (error) {
		console.error(`Failed to load blog post: ${slug}`, error);
		return null;
	}
}