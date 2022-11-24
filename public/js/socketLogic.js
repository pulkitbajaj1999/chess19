// socket-io logic
socket = io()
socket.on('event', (data) => {
  console.log('on-event: data', data)
  switch (data.action) {
    case 'reload':
      location.reload()
      break
    default:
      console.log('other-actions')
  }
})
