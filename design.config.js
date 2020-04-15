const path = require('path')

const icons = [
  'alert-circle',
  'barcode',
  'calendar-check',
  'check-circle',
  'close',
  'cog',
  'dots-vertical',
  'download',
  'earth',
  'file-document',
  'file-alert',
  'file-check',
  'help-circle',
  'help-circle-outline',
  'magnify',
  'new-box',
  'open-in-new',
  'puzzle',
  'sort-ascending',
  'sort-descending',
  'tune',
  'view-dashboard',
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
