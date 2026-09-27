# Your computer, your choices

A manuscript about operating systems, Linux, Fedora, security, and privacy.

**How to use this:** Read it aloud as a presentation, or read it on your own. The questions include answers, so you do not need a teacher beside you. Cover each answer while you think. You can take a break after section 5 and section 10.

The main story follows one thing: a picture you draw on a computer. You do not need to install anything to follow along. Source links are for readers who want to check a fact; you do not need to read them aloud.

## 1. You click. The computer gets to work.

Imagine drawing a cat on a computer.

You open a drawing app. You choose a blue brush. Music plays while you draw. When you finish, you press Save.

You did a few simple things. Inside the computer, lots of parts had to work together.

Something had to give the drawing app room to work. Something had to help the music reach the speakers. Something had to keep your picture so you could open it tomorrow.

The **operating system**, or **OS**, helps organize all of that.

An app does a job for you, such as drawing. The operating system helps apps use the computer's parts and sets rules for what they can do.

**Try this:** Name an app you use. What job does it do?

**Example answer:** A drawing app helps me make pictures. It relies on the operating system to use the computer.

## 2. RAM is working space. Storage keeps files.

Let's picture a drawing desk.

The picture you are drawing sits on the desk. When you finish, you put it in a cupboard so you can find it later.

A computer has both kinds of space.

**RAM** is the computer's short-term working space, also called working memory. The drawing app uses RAM while you work on the cat. When the power goes off, ordinary RAM loses what it was holding.

**Storage** keeps saved files, including when the computer is off. A file can hold a picture, a song, or your homework. Saving the cat is like putting your finished picture in the cupboard.

A program is a set of instructions for a computer. The **processor**, also called the **CPU**, follows those instructions to do the work.

The keyboard, screen, and speakers are **devices**. They help you give instructions or see and hear the results.

The operating system helps these parts work together. The desk and cupboard are a way to picture the two kinds of space. There isn't a tiny person drawing inside your computer.

**Pause and think:** Where should your finished cat picture go so you can open it tomorrow: RAM or storage?

**Answer:** Storage. Saving puts the picture in a file that can stay after the power goes off.

## 3. How do music and drawing share the CPU?

The drawing app needs the processor. So does the music app.

The operating system helps give running programs turns using the CPU. Picture a short turn for the drawing app, then a short turn for the music app. These turns can be so quick that both apps seem to work at once.

A CPU can also have several working parts, called **cores**. Different cores can do some work at the same time.

A running program is called a **process**. One app may use several processes.

Each process also needs RAM, the working space we pictured as a desk. If you open lots of apps, more programs need turns and working space. The computer may slow down.

The system uses rules to help keep one program from damaging another program's memory. Software can still contain mistakes. These mistakes are called **bugs**.

**Pause and think:** Does closing an app usually give the computer less work to do?

**Answer:** Yes. When its processes stop, they stop using processor time and working space. Some apps keep doing jobs even after their window closes, so closing a window does not always stop everything.

## 4. What happens when you save the cat?

You press Save and choose a name: `cat.png`.

The information that makes up your picture is called **data**. To save it, the app asks the operating system to **write** that data to a file. Here, write means put the information into the file.

The system checks whether the app is allowed to write in the place you chose. It then works with the storage device to keep the picture.

A **folder** helps organize files. You might put `cat.png` inside a folder called Pictures.

You do not have to tell the storage device how to handle each tiny piece. The operating system takes care of those details.

The operating system uses software called a **driver** to work with particular devices. A printer driver, for example, contains instructions for communicating with a printer.

Saving to a folder on your own computer can keep the file there. Some folders also copy files online automatically to keep copies up to date. This is called **syncing**. Later, we will check what that means for our picture.

## 5. The desktop you see and the kernel at work

When you open a folder with your mouse, you use windows, buttons, and menus. These are parts of the **desktop**.

The operating system also has parts that you do not see as windows or buttons.

The drawing app needs CPU time, RAM, and access to devices. These are some of the computer's **resources**, the things programs need to work. The **kernel** is a central part of the operating system that helps share CPU time, manage memory, and control access to devices.

You can also ask to see a folder's files by typing a **command**, an instruction to the computer. A **terminal** is the place where you type commands and read the results. A **shell** is the program that reads those commands and starts the work you ask for.

Clicking a folder and typing a command are two ways to ask the same computer for something.

You can use Linux with buttons and windows. Learning commands is something you can do a little at a time.

**Pause and think:** Is the desktop the whole operating system?

**Answer:** No. It is one part. The kernel and other software keep working underneath it.

*This is a good place for a break. You now know what the operating system helps do.*

## 6. Different systems do similar jobs

You may have heard of Windows or macOS. You may also have heard of Linux.

Windows is Microsoft's operating system. macOS is Apple's system for Mac computers. Fedora and Ubuntu are examples of systems built around Linux.

They all help run apps and manage the computer's parts. You can draw and save a picture on different systems, even though the buttons and available apps may differ.

We will spend more time with Linux and Fedora. I like using them to learn because you can study how the software works and change many parts of it.

You do not have to change your computer to understand any of this.

## 7. Linux, Fedora, and GNOME

You may hear these three names when someone describes one computer. Each name tells you about a different part of its software.

**Linux is a kernel.** Remember: the kernel helps manage the computer's resources.

A complete system needs more pieces, including tools and apps. People put those pieces together into a **distribution**, often shortened to **distro**.

**Fedora is a Linux distribution.** It brings those pieces together into a system you can use.

**GNOME is a desktop environment.** It provides the windows, menus, and other controls you use on the screen. Fedora Workstation is the Fedora edition we are using as our example, and it comes with GNOME. Other Fedora editions can use different desktops. [Fedora Workstation](https://fedoraproject.org/workstation/)

So when we say "Fedora Workstation with GNOME," we mean a complete system with a particular desktop. Linux is the kernel working inside that system.

**Pause and think:** Which name means the complete distribution: Linux, Fedora, or GNOME?

**Answer:** Fedora. Linux is its kernel, and GNOME is the desktop used by Fedora Workstation.

## 8. Open source lets people read the instructions

Think of the recipe for a cake. You can eat a cake without seeing its recipe. But seeing the recipe helps you understand how it was made.

Software has written instructions too. The instructions people write to make it are called **source code**.

Linux is **open-source** software. People are allowed to read its source code, change it, and share it under its **license**. A license sets the rules for what people may do with the software. [Linux kernel licensing rules](https://docs.kernel.org/process/license-rules.html)

Many people can help improve open software. One person may fix a bug. Another may translate the words on a button. Someone else may explain how to use it.

You may see the name **GNU** too. The GNU project makes many tools used alongside Linux. Its idea of free software includes the freedom to study, change, and share programs. You do not need to memorize all the tool names. [GNU's explanation of free software](https://www.gnu.org/philosophy/free-sw.en.html)

This is one reason I prefer Linux for learning: the instructions are there for people to study.

Open code can still contain bugs. People need time and skill to find and fix them. Being allowed to check the code does not mean someone has checked every line.

## 9. Why we are using Fedora as our example

Fedora Workstation gives us a desktop we can explore with a mouse, plus tools we can learn as we go. It is free to download and use. Its desktop has no built-in advertising. [Fedora Workstation](https://fedoraproject.org/workstation/)

I like being able to start with familiar things, such as opening a folder, and then learn about the software behind them.

Think of giving a worker keys to only the rooms needed for a job. Programs can have limits too. Fedora includes a tool called **SELinux** that adds rules limiting what certain programs can do. This can help limit the harm if a program goes wrong. Fedora enables SELinux by default. [Fedora security features](https://fedoraproject.org/wiki/Security_Features)

Fedora still needs updates. Some games, school apps, or devices may need extra work or may not work with it. Before switching a real computer, check the things you need with someone who can help.

Fedora is my choice for this lesson. For your own computer, the apps and devices you need matter too.

## 10. Where apps come from

To draw our cat, we need a drawing app.

On Fedora, the Software app helps you find and install apps. Software arrives in **packages**, bundles that hold software and the information needed to install it. A **repository** is a place that provides those packages for your computer.

Two apps in the same store can come from different places. An app from Fedora's own collection and an app from another provider may follow different rules. Check the source listed for the app. Fedora Workstation supports software from Fedora repositories and other sources such as Flathub. [Fedora Workstation](https://fedoraproject.org/workstation/)

A video call may need the camera. A simple drawing app usually has no reason to ask for your contacts, the names and details you save about other people.

An app may ask for **permission**, your approval to use something such as the camera. Before choosing Allow, ask whether it needs that access for its job.

You can refuse a request you do not understand. Ask a trusted adult before giving an unfamiliar app more access or installing it on a shared computer.

Some apps can already access things without showing a new permission box. That is another reason to check which apps you trust.

**Pause and think:** A drawing app asks to see your contacts. Should you press Allow just to make the box go away?

**Answer:** No. Find out why it wants them. You can say no, or choose another app.

*Take another break if you want. Next we will follow the information that can leave a computer.*

## 11. Security and privacy are different

Imagine your cat picture is inside a notebook.

You want to stop someone from stealing it or scribbling over it. That is a **security** concern.

You also want to decide who gets to see it and what they do with it. That is a **privacy** concern.

On a computer, security helps protect files, accounts, and the system from unwanted access or harm. Privacy concerns what information gets collected, how people use it, and who receives it.

A service might protect your password well and still collect lots of information about what you do. "Is my account protected?" and "What does this service learn about me?" are separate questions.

Linux can get harmful software too. Fedora's protections help, but no operating system makes every download safe.

Windows and macOS also include tools that check for harmful software and help protect the computer. [Windows Security](https://support.microsoft.com/en-us/windows/security/windows-security/stay-protected-with-the-windows-security-app), [Apple's app security guide](https://support.apple.com/guide/deployment/dep323ab8aa3/web)

**Pause and think:** A company keeps your account secure but uses your activity to choose ads. Can there still be a privacy question?

**Answer:** Yes. Protecting the account and deciding how its information gets used are different questions.

## 12. What information can a computer send?

An update check, an error report, and a picture you share can all send information. They send it for different reasons.

When your computer checks for updates, it may tell another computer which system version you use. That helps the other computer offer the right update. A computer that provides a service like this is called a **server**. A **network** connects computers so they can exchange information.

Suppose the drawing app stops working unexpectedly. That is a **crash**. A report describing the problem is an example of a **diagnostic report**: information about how software or a device is working.

Some reports also describe which features people use. Automatic reporting like this is often called **telemetry**.

Other services may receive the words you search for, the videos you watch, or files you send to them. A list of videos you watched says something different about you from your computer's system version.

The amount of data alone does not tell us how private something is. One tiny message containing your home address can matter more than a much larger list of technical errors.

Before sharing, ask: What information is being sent? Who gets it? What will they use it for? Can I choose?

## 13. What Windows, macOS, and Fedora send

How much information does each system send? There is no single daily amount for all Windows, Mac, or Fedora computers. It depends on the settings, installed apps, and what someone does on the computer. We can compare what kinds of information they send and which settings control it.

### Windows

On an ordinary Windows 11 home computer, Windows sends required diagnostic information to Microsoft. It includes details about the device, its settings, and how well it is working.

Optional reports are extra reports you can choose to send. They can add details about app use and activity, including browsing information and more detailed crash reports. A crash report can sometimes include bits of the information held in memory when the problem happened.

You can turn optional diagnostics off. That setting does not turn off required diagnostics or all the information used by services that connect to the internet. Those services have separate controls. [Microsoft's diagnostics explanation](https://support.microsoft.com/en-us/windows/privacy/diagnostics-feedback-and-privacy-in-windows), [Windows connected services](https://support.microsoft.com/en-us/windows/experience/essential-services-and-connected-experiences-for-windows)

### macOS

Apple calls its reports **analytics**. It says Mac analytics are sent with your permission. They can describe the computer's parts, its software, crashes, and how features are used.

You can review sharing in **System Settings, then Privacy & Security, then Analytics & Improvements**. Turning analytics off does not turn off every online service. Sharing a file through iCloud, for example, is a separate activity. [Apple's Mac analytics guide](https://support.apple.com/guide/mac-help/share-analytics-information-mac-apple-mh27990/mac)

### Fedora

Fedora also sends some information.

Its update system has a feature called **countme**. It helps count systems using details such as the Fedora version and roughly how long it has been installed on a computer. Think of tally marks showing how many systems are checking for updates. This counting feature does not send the contents of your cat picture or a list of every app you open.

The servers handling these requests can still record an IP address and the time of the connection. An **IP address** helps computers send messages to the right place, a little like a return address on a letter. Several devices can share one public IP address. Fedora publishes combined counts rather than these individual connection records. [Fedora's countme implementation](https://github.com/fedora-infra/mirrors-countme)

Crash reporting and the apps you install are separate. A crash report may include more detail, so check what you are sharing. [Fedora's crash reporting service](https://abrt.fedoraproject.org/)

**Pause and think:** If you turn off optional system reports, have you stopped every app and website from collecting data?

**Answer:** No. Apps, websites, and online accounts have their own settings and behavior.

## 14. Our picture goes online

Let's return to the cat.

You save it in a folder on your computer that does not copy files online automatically. Saving the file does not, by itself, require an upload.

Then you choose to **upload** it to a website. Uploading means sending a copy from your computer to another computer over a network. Now that website receives your picture.

If you upload it while signed in, the website can connect the action with your account. Using Fedora does not hide that connection.

The same idea applies to videos. A video service can record which videos your signed-in account watches, whatever operating system you use.

Check the settings in each place: the operating system, the app you use to open websites, the websites themselves, and other apps. The app for opening websites is called a **browser**. It has its own data settings too. [Firefox's privacy notice](https://www.mozilla.org/en-US/privacy/firefox/)

Changing the operating system can change some choices. Your choices inside apps and websites still matter.

**Try this:** You draw a picture, then upload it to a class website. At which step does the website get the picture?

**Answer:** When you upload it. If an app or folder uploads automatically, it can send the picture earlier, so check its sync settings too.

## 15. Small habits that help

Here are a few things you can do to help protect your picture and your accounts.

Install updates. They often repair mistakes, including security problems.

Get apps from sources you trust, and check the source before installing. A random pop-up saying your computer is broken is a reason to stop and ask for help.

Use a different password for each account, and make it long and hard to guess. A **password manager** is an app that can help keep track of those passwords. Some accounts offer a second sign-in step, such as a code from another app. A trusted adult can help you set that up.

Before allowing an app to use your camera, microphone, location, or files, ask what it needs them for. Give it only the access it needs.

Keep an extra copy of important work somewhere separate. That copy is a **backup**. If the computer breaks or you delete the cat picture, the backup may let you get it back.

If something feels wrong, ask for help. Accidentally clicking a strange link is something to fix, not something you need to hide.

## 16. A small Linux-style experiment

Our presentation includes a pretend desktop called **opitlcalOS**. It runs inside a web page. It borrows ideas from Linux desktops, but it is a teaching model, not a real Fedora installation. Its files and system numbers are pretend.

We will use the folder at `/home/student/Documents`. A folder or file's address is called its **path**. If you have the presentation open, try this:

1. Open **Files**, then open the **Documents** folder. Find `notes.txt`.
2. Open **Terminal**.
3. Type `ls /home/student/Documents` and press Enter. This asks for the names in that folder.
4. Type `cat /home/student/Documents/notes.txt` and press Enter. This asks to read the text file.

You have used a window and typed commands to explore the same pretend files. These commands only list names and read text.

If you are reading this manuscript alone, picture the result. The Files window shows a file named `notes.txt`. The `ls` command shows that name too. The `cat` command shows the words inside the file.

On a real computer, commands can also change or delete things. Ask what an unfamiliar command does before copying it.

## 17. Back to the blue cat

At the start, you opened an app, drew a cat, and saved it.

Think back through what made that possible.

The processor followed instructions. RAM held working data. The operating system helped the app use those resources. Saving kept the picture in storage.

Linux can be the kernel inside that system. Fedora brings Linux and other software together. GNOME gives Fedora Workstation its desktop.

When you share the picture, someone else receives information. Security helps protect it. Privacy asks who gets it and how they use it.

I like Fedora as a place to explore and learn. To try something yourself, start with one small task: open a folder, check an app's permissions, or find out what one setting means.

Your next click can be a choice you understand.

## Check what you learned

Try these before looking at the answers.

1. What helps apps share the computer's parts?
2. Which holds the work an app is using now: RAM or long-term storage?
3. Which is the distribution: Fedora or GNOME?
4. Does open-source software promise that there are no bugs?
5. Does Fedora make a website forget which account you signed in to?
6. A game asks for your microphone even though you only want to play alone. What could you do?
7. If you switch off optional reports in Windows, can it still send other information?
8. What could help recover your picture if the computer breaks?

**Answers**

1. The operating system.
2. RAM. Storage keeps saved files for later.
3. Fedora. GNOME is a desktop environment.
4. No. People can inspect and improve the code, but mistakes still happen.
5. No. The website can still connect activity to your signed-in account.
6. Refuse the permission and check why it wants access. Ask a trusted adult if you are unsure.
7. Yes. Required reports can still be sent, and online services have their own settings.
8. A backup stored separately from that computer.

---

## Notes for the presenter and future slide edit

These notes are not part of the spoken manuscript.

- The supplied PDF contains four scanned textbook pages, numbered 44–47. This manuscript keeps its core subjects: what an operating system does, resources, kernel and interfaces, major systems, Linux distributions, and open software. It replaces the historical survey with Linux, security, and privacy teaching. It does not reproduce the textbook's prose.
- Omit DOS, the Windows version timeline, old market-share figures, and date memorization. The old figure also has inconsistent labels, so it should not become a modern comparison chart.
- Correct the source's grouping: macOS is a separate system, not a Linux distribution. An OS contains more than a kernel and shell. Many distributions use GNU tools, but every Linux-based system does not require the same GNU components. Typed commands are available to beginners too.
- Keep system calls, threads, context switches, the MMU, page tables, and page faults out of the required beginner path. They can become an optional later lesson after the learner understands processes and working memory.
- The preference for Fedora is a stated teaching preference, not a measured claim that it wins every security or privacy comparison. No comparable daily data-volume measurement was supplied or performed. The text compares documented categories and controls.
- Privacy and product claims were checked against the linked primary sources on **27 September 2026**. Fedora's proposed broader Workstation usage-metrics system is marked **DROPPED / CLOSED WONTFIX**; do not present its proposed features as installed behavior. [Fedora Opt-In Metrics proposal status](https://fedoraproject.org/wiki/Changes/Metrics)
- `countme` is a flag attached to an update-metadata request about once per week per enabled repository when enabled. The official Fedora repository configuration enables it. The age bucket is the repository's approximation of installation age, not a person's age. Server logs and published aggregate statistics are different datasets. [DNF5 configuration](https://dnf5.readthedocs.io/en/latest/dnf5.conf.5.html#options-for-both-main-and-repo), [Fedora countme implementation](https://github.com/fedora-infra/mirrors-countme)
- Crash detection and crash-report transmission are separate. ABRT supports automatic and user-assisted reporting; behavior depends on configuration. Do not promise that all crash reports always upload or that none ever do. [ABRT configuration](https://abrt.readthedocs.io/en/latest/conf.html)
- Treat the small command exercise as an opitlcalOS demonstration. Its paths and pretend files belong to this project. The manuscript does not ask a child to install Fedora, replace an operating system, or run administrative commands.
- The presentation follows this manuscript in English and Mongolian, with 17 chapters, eight review questions, and a Read along view containing the full narration. Choose the language in Settings. Technical terms such as RAM, CPU, and kernel stay in English in the Mongolian version.
