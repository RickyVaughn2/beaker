/*
This uses the beakerDownloads API, which is exposed by webview-preload to all sites loaded over the beaker: protocol
*/

import * as yo from 'yo-yo'
import co from 'co'
import ArchivesList from '../model/archives-list'
import DownloadsList from '../model/downloads-list'
import { render as renderArchivesList } from '../com/archives-list'
import { render as renderDownloadsList } from '../com/downloads-list'

// globals
// =

var isViewActive = false
var archivesList
var downloadsList

// exported API
// =

export function setup () {
}

export function show () {
  isViewActive = true
  document.title = 'Downloads'
  co(function* () {
    // fetch downloads
    downloadsList = new DownloadsList()
    yield downloadsList.setup()
    downloadsList.on('changed', render)

    // fetch archives
    archivesList = new ArchivesList()
    yield archivesList.setup({
      filter: { isOwner: false, isSaved: true },
      fetchStats: true
    })
    archivesList.on('changed', render)

    // render
    render()
  })
}

export function hide () {
  isViewActive = false
  downloadsList.destroy()
  archivesList.destroy()
  downloadsList = null
  archivesList = null
}

// rendering
// =

function render () {
  if (!isViewActive) {
    return
  }

  yo.update(document.querySelector('#el-content'), yo`<div class="pane" id="el-content">
    <div class="downloads">
      <div class="ll-heading">
        Saved Archives
        <small class="ll-heading-right">
          <a href="https://beakerbrowser.com/docs/" title="Get Help"><span class="icon icon-lifebuoy"></span> Help</a>
        </small>
      </div>
      ${renderArchivesList(archivesList, { renderEmpty, render })}
      <div class="ll-heading">
        File Downloads
      </div>
      ${renderDownloadsList(downloadsList)}
    </div>
  </div>`)
}

function renderEmpty () {
  return yo`<div class="ll-empty">
    Archives that you download will be saved here.
  </div>`
}
