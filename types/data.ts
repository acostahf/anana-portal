interface User {
	id: number;
	name: string;
	email: string;
	created_at: Date;
	favorites: Recipe[];
}

interface Region {
	id: number;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

interface Category {
	id: number;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

interface Skill {
	id: number;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

interface Tag {
	id: number;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

interface Badge {
	id: number;
	title: string;
	updatedAt: Date;
	createdAt: Date;
}

interface Media {
	id: number;
	alt: string;
	updatedAt: Date;
	createdAt: Date;
	url?: string;
	thumbnailURL?: string;
	filename?: string;
	mimeType?: string;
	filesize?: number;
	width?: number;
	height?: number;
	focalX?: number;
	focalY?: number;
}

interface Ingredient {
	id?: number;
	title: string;
	hint: string;
	updated_at?: string;
	created_at?: string;
}

interface RecipeStepIngredient {
	id: string;
	_order: number;
	_parent_id: RecipeStep;
	ingredient_id: Ingredient;
	quantity: number;
	unit: string;
}

interface RecipeStep {
	id: string;
	_order: number;
	_parent_id: Recipe;
	title: string;
	description: string;
	image_id: Image;
}
interface RecipeStepWithIngredients extends RecipeStep {
	ingredients: RecipeStepIngredient[];
}

interface Grandparent_rels {
	media_id: Media;
}

interface Grandparent {
	id: number;
	title: string;
	updated_at: string;
	created_at: string;
	home: string;
	latitude: number;
	longitude: number;
	region_id: Region;
	video: string;
	favorites_id: Recipe;
	level: string;
	personality: string;
	perfect_for: string;
	bio: string;
	image_id: Image;
	photos: {
		path: string;
		media_id: Media;
		badges_id: null;
	}[];
	badges: {
		path: string;
		media_id: null;
		badges_id: { title: string };
	}[];
}

interface Recipe {
	id: number;
	slug: string;
	title: string;
	description: string;
	cook_time: number;
	roots: string;
	dish: string;
	video: string;
	updated_at: string;
	created_at: string;
	region_id: Region;
	grandparents_id: Grandparent;
	image_id: Image;
	category: string;
	published: boolean;
}

interface Image {
	alt: string;
	created_at: string;
	filename: string;
	filesize: number;
	focal_x: number;
	focal_y: number;
	height: number;
	id: number;
	mime_type: string;
	thumbnail_u_r_l: string | null;
	updated_at: string;
	url: string | null;
	width: number;
}

export type {
	User,
	Region,
	Category,
	Skill,
	Tag,
	Badge,
	Grandparent,
	Recipe,
	Media,
	Image,
	RecipeStep,
	RecipeStepIngredient,
	Ingredient,
	RecipeStepWithIngredients,
};
