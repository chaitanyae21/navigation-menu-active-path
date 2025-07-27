/*
 * This file defines reusable components for the navigation menu. Keeping
 * component definitions in a separate script encourages reuse across
 * multiple applications without duplicating code.
 */

// MenuItem represents a single item in the navigation tree. It takes an
// `item` object with id, label and children; the `activePath` array of IDs
// representing the current active breadcrumb; and `onNavigate` callback to
// update the active ID when clicked.
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

// Expose MenuItem globally so other scripts can access it without imports.
window.MenuItem = MenuItem;