export default function ThemeColor() {
  document.body.style.setProperty('--el-color-primary', '#b19cd9') //主色
  document.body.style.setProperty('--el-color-success', '#8bcecbff') //成功色
  document.body.style.setProperty('--el-color-waring', '#f2c94c') //警告色
  document.body.style.setProperty('--el-color-info', '#d4bbe5')
  document.body.style.setProperty('--el-color-danger', '#e76f51')

  // hover时cancel的border颜色
  document.body.style.setProperty('--el-color-primary-light-7', '#b19cd9')
  // hover时cancel的bg颜色
  document.body.style.setProperty('--el-color-primary-light-9', '#e9e3edff')

  //  confirm
  // hover时confirm的bg颜色
  document.body.style.setProperty('--el-color-primary-light-3', '#d4bbe5')
  //   --el-button-active-bg-color: var(--el-color-primary-dark-2);
  // --el-button-active-border-color: var(--el-color-primary-dark-2);
  document.body.style.setProperty('--el-color-primary-dark-2', '#b19cd9')
}
