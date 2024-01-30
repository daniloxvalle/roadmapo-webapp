import { Component, h } from "vue";
import type { IconSet, IconProps } from 'vuetify'
import ArchiveEyeOffIcon from "@/components/icons/ArchiveEyeOffIcon.vue"

function iconNameToComponent(iconName: any): Component {
   switch (iconName) {
      case 'archive-eye-off-icon':
         return ArchiveEyeOffIcon
      default:
         return ArchiveEyeOffIcon
   }
}

const customSvgIcons: IconSet = {
   component: (props: IconProps) => h(iconNameToComponent(props.icon)),
};

export { customSvgIcons };