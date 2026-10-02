(Event loop)

So the way I understand it, the event loop is what lets Node.js avoid sitting around waiting. If I ask it to read a file or wait for a network response, it doesn't freeze until that finishes. It keeps working on other stuff, and when the result is ready, the event loop runs the function that handles it.

(Libuv)

Libuv is a library that Node.js uses under the hood. It's basically what runs the event loop, timers, and async operations. It also gives Node.js a thread pool for some tasks, like file operations.

(How async operations work)

When Node.js starts an async operation, it doesn't wait for it to finish. The operating system or Libuv handles it in the background, and once it's done, Node.js runs the callback or Promise code that goes with it.

(Call stack and event queue)

The call stack keeps track of the JavaScript functions running at that moment. Callback queues hold functions waiting to run. The event loop checks these queues and runs callbacks when the current JavaScript work has finished.

(Thread pool)

The thread pool is a group of worker threads that Node.js uses for certain tasks, like file operations. The default size is 4 threads, but we can change it by setting UV_THREADPOOL_SIZE before starting Node.js. For example, in PowerShell:

$env:UV_THREADPOOL_SIZE = "8"
node server.js

(Blocking vs non-blocking)

Blocking code makes Node.js stop and wait until the task is done. For example, fs.readFileSync() holds everything up while it reads the file. Non-blocking code lets Node.js keep doing other things while it waits. For example, fs.readFile() starts reading the file and calls the callback when it's done.