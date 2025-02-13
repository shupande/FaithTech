import { type IconProps } from "@/types"
import { Icon } from '@iconify/react'

const iconProps = {
  width: 24,
  height: 24,
} as const

export const Icons = {
  twitter: function IconTwitter({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:twitter" {...iconProps} className={className} />
    )
  },
  facebook: function IconFacebook({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:facebook" {...iconProps} className={className} />
    )
  },
  linkedin: function IconLinkedin({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:linkedin" {...iconProps} className={className} />
    )
  },
  youtube: function IconYoutube({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:youtube" {...iconProps} className={className} />
    )
  },
  instagram: function IconInstagram({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:instagram" {...iconProps} className={className} />
    )
  },
  tiktok: function IconTiktok({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:tiktok" {...iconProps} className={className} />
    )
  },
  wechat: function IconWechat({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:wechat" {...iconProps} className={className} />
    )
  },
  whatsapp: function IconWhatsapp({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:whatsapp" {...iconProps} className={className} />
    )
  },
  qq: function IconQQ({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:tencentqq" {...iconProps} className={className} />
    )
  },
  skype: function IconSkype({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:skype" {...iconProps} className={className} />
    )
  },
  github: function IconGithub({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:github" {...iconProps} className={className} />
    )
  },
  email: function IconEmail({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:gmail" {...iconProps} className={className} />
    )
  },
  phone: function IconPhone({ className }: IconProps) {
    return (
      <Icon icon="simple-icons:googlemessages" {...iconProps} className={className} />
    )
  },
  spinner: function IconSpinner(props: IconProps) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    )
  },
} 