export type NotificationItem = {
  id?: number | string
  title: string
  content: string
  is_read: "yes" | "no"
  created_at: string
  link: string
}