export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Product Image (Main)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Upload additional images for the product gallery.',
    },
    {
      name: 'videoUrl',
      title: 'Product Video URL',
      type: 'url',
      description: 'Optional video URL (e.g., YouTube or Vimeo link) for the product.',
    },
    {
      name: 'reviews',
      title: 'Customer Reviews',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Reviewer Name', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'rating', title: 'Rating', type: 'number', validation: (Rule: any) => Rule.required().min(1).max(5) },
            { name: 'comment', title: 'Comment', type: 'text', validation: (Rule: any) => Rule.required() },
          ],
        },
      ],
      description: 'Add manual customer reviews here.',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(5),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Kids', value: 'Kids' },
          { title: 'Beauty', value: 'Beauty' },
          { title: 'Fashion', value: 'Fashion' },
          { title: 'Home & Design', value: 'Home & Design' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'discount',
      title: 'Discount Percentage',
      type: 'number',
      description: 'Enter a number (e.g., 20 for 20% OFF). Leave as 0 if no discount.',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0).max(100),
    },
    {
      name: 'affiliateLink',
      title: 'Affiliate Link',
      type: 'url',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isFeatured',
      title: 'Featured (Today\'s Deals)',
      type: 'boolean',
      description: 'Turn on to show this product in the "Today\'s Deals" section.',
      initialValue: false,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'Active' },
          { title: 'Expired', value: 'Expired' },
        ],
        layout: 'radio',
      },
      initialValue: 'Active',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
};
