const { useState, useEffect } = React;

// Example menu data structure
const menuData = [
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

// Helper to find path to a node
function findPath(items, id, path = []) {
  for (const item of items) {
    if (item.id === id) return [...path, item.id];
    if (item.children) {
      const result = findPath(item.children, id, [...path, item.id]);
      if (result) return result;
    }
  }
  return null;
}

function MenuItem({ item, activePath, onNavigate }) {
  const isActive = activePath.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;
  return React.createElement(
    'li',
    { className: isActive ? 'active' : '' },
    [
      React.createElement(
        'a',
        {
          key: 'link',
          href: `#${item.id}`,
          onClick: (e) => {
            e.preventDefault();
            onNavigate(item.id);
          }
        },
        item.label
      ),
      hasChildren && isActive
        ? React.createElement(
            'ul',
            { key: 'children' },
            item.children.map((child) =>
              React.createElement(MenuItem, {
                key: child.id,
                item: child,
                activePath,
                onNavigate
              })
            )
          )
        : null
    ]
  );
}

function NavigationMenu() {
  const [activeId, setActiveId] = useState(() => window.location.hash.substring(1) || 'home');
  useEffect(() => {
    function onHashChange() {
      const id = window.location.hash.substring(1);
      setActiveId(id || 'home');
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const activePath = findPath(menuData, activeId) || [activeId];
  const handleNavigate = (id) => {
    // update hash to preserve URL state
    window.location.hash = id;
  };
  return React.createElement(
    'ul',
    { className: 'nav-menu' },
    menuData.map((item) =>
      React.createElement(MenuItem, {
        key: item.id,
        item,
        activePath,
        onNavigate: handleNavigate
      })
    )
  );
}

ReactDOM.render(React.createElement(NavigationMenu), document.getElementById('root'));