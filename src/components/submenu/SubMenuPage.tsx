import React from 'react';
import { MenuModuleConfig, SubMenuItemConfig } from '../../types';
import { SubMenuHeader } from '../common/SubMenuHeader';
import { SubMenuCardList } from '../common/SubMenuCardList';
import { Sparkles } from 'lucide-react';

interface SubMenuPageProps {
  module: MenuModuleConfig;
  onBack: () => void;
  onSelectSubMenu: (subItem: SubMenuItemConfig) => void;
  activeSubMenuId?: string;
}

export const SubMenuPage: React.FC<SubMenuPageProps> = ({
  module,
  onBack,
  onSelectSubMenu,
  activeSubMenuId
}) => {
  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* 
        Top Header: Solid green background with a back arrow icon on the left, 
        a white module title, a secondary subtitle, and a subtle vector illustration graphic on the right.
        Below the header: rounded white container card displaying small info icon and title label.
      */}
      <SubMenuHeader
        title={module.title}
        iconName={module.iconName}
        onBack={onBack}
      />

      {/* Content Body: Clean list of sub-menu cards */}
      <div className="flex-1 bg-slate-50/50">
        <SubMenuCardList
          items={module.subMenus}
          onSelectItem={onSelectSubMenu}
          activeId={activeSubMenuId}
        />
      </div>
    </div>
  );
};
