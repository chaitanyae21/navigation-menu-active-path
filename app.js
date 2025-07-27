// Pull React hooks from the global React object.
const { useState, useEffect, useCallback } = React;

// The menuData is defined in data.js and attached to the window. This avoids
// duplicating the data structure and makes it easier to adjust in one place.
const menuData = window.menuData;

// Custom hook for tracking the currently active menu item based on the URL
// hash. When the active ID changes, the URL hash is updated, preserving
// navigation state across reloads. The hook returns the current active ID
// along with a navigate function.
function useActiveId(defaultId = 'home') {
  const [activeId, setActiveId] = useState(() => window.location.hash.substring(1) || defaultId);
  useEffect(() => {
    function onHashChange() {
      const id = window.location.hash.substring(1);
      setActiveId(id || defaultId);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [defaultId]);
  const navigate = useCallback((id) => {
    window.location.hash = id;
  }, []);
  return [activeId, navigate];
}

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
      // Link to update the active menu ID. Prevent default anchor behavior
      // because we manually update the hash via onNavigate.
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
      // Recursively render children only if this item is in the active path.
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
  const [activeId, navigate] = useActiveId('home');
  // Determine the full path from the root to the active item. If no path
  // exists (e.g. invalid hash), fall back to the active ID itself.
  const activePath = findPath(menuData, activeId) || [activeId];
  return React.createElement(
    'ul',
    { className: 'nav-menu' },
    menuData.map((item) =>
      React.createElement(MenuItem, {
        key: item.id,
        item,
        activePath,
        onNavigate: navigate
      })
    )
  );
}

ReactDOM.render(React.createElement(NavigationMenu), document.getElementById('root'));