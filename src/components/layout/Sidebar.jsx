import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, AlertTriangle, FileText, Code2, GitBranch, Network,
  Wrench, GitPullRequest, Workflow, Settings, Key, Plug,
  ChevronLeft, ChevronRight, Shield, Bot, Zap,
  ChevronDown, User, Building2
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'CONTROL PLANE',
    items: [
      {
        group: 'Overview',
        children: [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        ]
      },
      {
        group: 'Operations',
        children: [
          { id: 'incidents', label: 'Incidents', icon: AlertTriangle, path: '/incidents', badgeKey: 'incidents' },
          { id: 'reports', label: 'Incident Reports', icon: FileText, path: '/reports' },
        ]
      },
      {
        group: 'Intelligence',
        children: [
          { id: 'code-intelligence', label: 'Code Intelligence', icon: Code2, path: '/code-intelligence' },
          { id: 'service-map', label: 'Service Map', icon: Network, path: '/service-map' },
          { id: 'dependency-graph', label: 'Dependency Graph', icon: GitBranch, path: '/dependency-graph' },
        ]
      },
      {
        group: 'Remediation',
        children: [
          { id: 'fixes', label: 'Fixes', icon: Wrench, path: '/fixes', badgeKey: 'fixes' },
          { id: 'pull-requests', label: 'Pull Requests', icon: GitPullRequest, path: '/pull-requests', badgeKey: 'pullRequests' },
        ]
      },
      {
        group: 'Automation',
        children: [
          { id: 'automations', label: 'Automations', icon: Bot, path: '/automations' },
          { id: 'workflows', label: 'Workflows', icon: Workflow, path: '/workflows' },
        ]
      },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      {
        group: null,
        children: [
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
          { id: 'api-keys', label: 'API Keys', icon: Key, path: '/api-keys' },
          { id: 'integrations', label: 'Integrations', icon: Plug, path: '/integrations' },
        ]
      },
    ]
  }
];

export function Sidebar({
  collapsed,
  onToggle,
  activePath,
  onNavigate,
  badges = {},
  user,
  environment
}) {
  const [openGroups, setOpenGroups] = useState({});

  // Auto-expand group containing active path
  useEffect(() => {
    NAV_SECTIONS.forEach(section => {
      section.items.forEach(group => {
        const match = group.children.find(c => activePath?.startsWith(c.path));
        if (match && group.group) {
          setOpenGroups(prev => ({ ...prev, [group.group]: true }));
        }
      });
    });
  }, [activePath]);

  const toggleGroup = (group) => {
    if (collapsed) return;
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isActive = (path) => {
    if (path === '/dashboard') return activePath === '/dashboard' || activePath === '/';
    return activePath?.startsWith(path);
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      {/* Brand */}
      <div className={`flex items-center h-14 border-b border-gray-200 flex-shrink-0 ${collapsed ? 'px-3 justify-center' : 'px-4'}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-gray-900 leading-tight truncate">
                Control Plane
              </div>
              <div className="text-[10px] text-gray-500 font-medium leading-tight">
                Incident Response
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.label} className={sIdx > 0 ? 'mt-1' : ''}>
            {/* Section separator */}
            {sIdx > 0 && <div className="mx-3 my-2 border-t border-gray-100" />}

            {!collapsed && (
              <div className="px-4 pt-3 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {section.label}
                </span>
              </div>
            )}

            {section.items.map((group) => (
              <div key={group.group || 'ungrouped'}>
                {/* Group header (collapsible) */}
                {group.group && !collapsed && (
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex items-center justify-between px-4 py-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <span>{group.group}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-150 ${
                        openGroups[group.group] !== false ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>
                )}

                {/* Nav items */}
                {(collapsed || !group.group || openGroups[group.group] !== false) && (
                  <div className={collapsed ? 'px-2 space-y-0.5' : 'px-2 space-y-0.5'}>
                    {group.children.map((item) => {
                      const active = isActive(item.path);
                      const badge = item.badgeKey ? badges[item.badgeKey] : null;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => onNavigate(item.path)}
                          title={collapsed ? item.label : undefined}
                          className={`group relative w-full flex items-center gap-2.5 rounded-md transition-colors duration-100 outline-none
                            ${collapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-[7px]'}
                            ${active
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                            focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
                          `}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />

                          {!collapsed && (
                            <>
                              <span className={`text-[13px] truncate ${active ? 'font-semibold' : 'font-medium'}`}>
                                {item.label}
                              </span>
                              {badge > 0 && (
                                <span className="ml-auto flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold px-1">
                                  {badge > 99 ? '99+' : badge}
                                </span>
                              )}
                            </>
                          )}

                          {/* Collapsed badge dot */}
                          {collapsed && badge > 0 && (
                            <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
                          )}

                          {/* Collapsed tooltip */}
                          {collapsed && (
                            <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                              {item.label}
                              {badge > 0 && (
                                <span className="ml-1.5 text-indigo-300">({badge})</span>
                              )}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="mx-3 mb-2 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Footer: Environment & User */}
      <div className={`border-t border-gray-200 flex-shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-8 h-8 rounded-full border border-gray-200 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-gray-900 truncate">
                {user?.displayName || user?.username || 'Operator'}
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  environment === 'production' ? 'bg-green-500' :
                  environment === 'staging' ? 'bg-amber-500' : 'bg-indigo-500'
                }`} />
                <span className="text-[10px] text-gray-500 font-medium capitalize truncate">
                  {environment || 'production'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-7 h-7 rounded-full border border-gray-200 object-cover"
                title={user?.displayName || user?.username}
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center" title="Operator">
                <User className="w-3.5 h-3.5 text-gray-400" />
              </div>
            )}
            <span className={`w-1.5 h-1.5 rounded-full ${
              environment === 'production' ? 'bg-green-500' :
              environment === 'staging' ? 'bg-amber-500' : 'bg-indigo-500'
            }`} title={environment || 'production'} />
          </div>
        )}
      </div>
    </aside>
  );
}
