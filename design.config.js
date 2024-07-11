const path = require('path')

const icons = [
  'account-group',
  'alert',
  'alert-outline',
  'alert-circle',
  'alert-circle-outline',
  'auto-download',
  'download',
  'download-circle',
  'download-box',
  'barcode',
  'calendar-check',
  'check-circle',
  'close',
  'close-circle-outline',
  'cog',
  'comment-multiple',
  'fresh-finds',
  'dots-vertical',
  'download',
  'earth',
  'eye',
  'eye-off',
  'file-document',
  'file-alert',
  'file-check',
  'file-download',
  'help-circle',
  'help-circle-outline',
  'information-outline',
  'magnify',
  'new-box',
  'open-in-new',
  'puzzle',
  'sort-ascending',
  'sort-descending',
  'tune',
  'view-dashboard',
  'menu',
  'pencil',
  'sync',
]

const iconsRoot = path.join(
  path.dirname(require.resolve('@mdi/svg/package.json')),
  './svg'
)

const config = {
  icons: {
    path: iconsRoot,
    files: icons,
  },

  output: {
    path: path.join(__dirname, 'public/design'),
    publicPath: '/design',
    icons: {
      files: 'icons',
      sprite: 'icons.svg',
    },
  },
}

module.exports = config
