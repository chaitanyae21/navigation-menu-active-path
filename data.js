// menuData: nested structure representing the navigation hierarchy.
// Expose it on the global window so other scripts can read it.
window.menuData = [
  {
    id: 'home',
    label: 'Home',
    children: []
  },
  {
    id: 'products',
    label: 'Products',
    children: [
      {
        id: 'software',
        label: 'Software',
        children: [
          { id: 'jira', label: 'Jira', children: [] },
          { id: 'confluence', label: 'Confluence', children: [] }
        ]
      },
      {
        id: 'hardware',
        label: 'Hardware',
        children: [
          { id: 'servers', label: 'Servers', children: [] },
          { id: 'laptops', label: 'Laptops', children: [] }
        ]
      }
    ]
  },
  {
    id: 'about',
    label: 'About',
    children: []
  }
];