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

## 2. A desk, some space, and a cupboard

Let's picture a drawing desk.

You need space on the desk for the work you are doing now. You also need somewhere to keep finished pictures.

A computer has both kinds of space.

**RAM** is its short-term working space. Apps use it while they run. When the power goes off, ordinary RAM loses what it was holding.

**Storage** keeps saved files, including when the computer is off. A file can hold a picture, a song, or your homework. Storage is like the cupboard where you keep your work.

The **processor**, also called the **CPU**, carries out instructions. It does the work of following the program's steps.

The keyboard, screen, and speakers are **devices**. They help you give instructions or see and hear the results.

The operating system helps these parts work together. Our desk is just a way to picture the idea; there isn't a tiny person drawing inside your computer.

**Pause and think:** Where should your finished cat picture go so you can open it tomorrow: RAM or storage?

**Answer:** Storage. Saving puts the picture in a file that can stay after the power goes off.

## 3. How can music play while you draw?

The drawing app needs the processor. So does the music app.

The operating system helps give running programs turns. The turns can be so short that both apps seem to work at once. A processor can also have several working parts, called cores, so some work really can happen at the same time.

A running program is called a **process**. One app may use several processes.

Each process also needs some of the computer's working space, called RAM. If you open lots of apps, the computer has more work to manage and may slow down.

The system uses rules to help keep programs from damaging each other's memory. These rules help, but mistakes in the software, called **bugs**, can still happen.

**Pause and think:** Does closing an app usually give the computer less work to do?

**Answer:** Yes. When its processes stop, they stop using processor time and working space. Some apps keep doing jobs even after their window closes, so closing a window does not always stop everything.

## 4. What happens when you save the cat?

You press Save and choose a name: `cat.png`.

The app asks the operating system to write the file. The system checks whether the app is allowed to write in that place. It then works with the storage device to keep the **data**, the information that makes up your picture.

A **folder** helps organize files. You might put `cat.png` inside a folder called Pictures.

You do not have to tell the storage device how to handle each tiny piece. The operating system takes care of those details.

It uses software called a **driver** to work with particular devices. A printer driver, for example, knows how to communicate with a printer.

Saving to a folder on your own computer can keep the file there. Some folders also copy files online automatically. This is called **syncing**. We will come back to that when we talk about privacy.

## 5. The kernel and the parts you can see

An operating system has many parts.

One central part is the **kernel**. It helps share processor time, manage memory, and control access to devices. These are some of the computer's **resources**, the things programs need to get work done.

The **desktop** gives you things you can see and use: windows, buttons, and menus.

You can also type commands. A **terminal** is a place to type them and read the results. A **shell** reads the commands and starts the work you ask for.

For example, you can open a folder with a mouse. You can also ask to see its files with a typed command. These are different ways to use the same computer.

You can use Linux with buttons and windows. Learning commands is something you can do a little at a time.

**Pause and think:** Is the desktop the whole operating system?

**Answer:** No. It is one part. The kernel and other software keep working underneath it.

*This is a good place for a break. You now know what the operating system helps do.*

## 6. Different systems do similar jobs

You may have heard of Windows or macOS. You may also have heard of Linux.

Windows is Microsoft's operating system. macOS is Apple's system for Mac computers. Fedora and Ubuntu are examples of systems built around Linux.

They all help run apps and manage the computer's parts. Their controls, included software, and choices differ.

For this lesson, we will spend more time with Linux and Fedora. I like them as places to learn because you can explore how the software works and change many parts of it.

You do not have to change your computer to understand any of this.

## 7. Linux, Fedora, and GNOME

These three names describe different pieces.

**Linux is a kernel.** Remember: the kernel helps manage the computer's resources.

A complete system needs more pieces, including tools and apps. People put those pieces together into a **distribution**, often shortened to **distro**.

**Fedora is a Linux distribution.** It brings those pieces together into a system you can use.

**GNOME is a desktop environment.** It supplies much of the screen you interact with. Fedora Workstation is the Fedora edition we are using as our example, and it comes with GNOME. Other Fedora editions can use different desktops. [Fedora Workstation](https://fedoraproject.org/workstation/)

Think of a bicycle. Linux is like an important working part. Fedora is like the assembled bicycle. GNOME is like the controls you reach for while riding. The real software has more pieces, but this helps us keep the names straight.

**Pause and think:** Which name means the complete distribution: Linux, Fedora, or GNOME?

**Answer:** Fedora. Linux is its kernel, and GNOME is the desktop used by Fedora Workstation.

## 8. Why open software matters

People write instructions to make software. Those instructions are called **source code**.

Think of the recipe for a cake. You can eat a cake without seeing its recipe. But seeing the recipe helps you understand how it was made.

Linux is open-source software. Its license lets people study the code, change it, and share it under the license's rules. A license tells people what they are allowed to do with the software. [Linux kernel licensing rules](https://docs.kernel.org/process/license-rules.html)

Many people can help improve open software. One person may fix a bug. Another may translate the words on a button. Someone else may explain how to use it.

You may see the name **GNU** too. The GNU project makes many tools used alongside Linux. Its idea of free software includes the freedom to study, change, and share programs. You do not need to memorize all the tool names. [GNU's explanation of free software](https://www.gnu.org/philosophy/free-sw.en.html)

This is a big reason I prefer Linux for learning. You can keep asking how things work.

Open code can still contain mistakes. People need time and skill to find them and fix them. Being open gives people a way to check; it does not promise that someone has checked every line.

## 9. Why I would choose Fedora for this lesson

Fedora Workstation gives us a desktop we can explore with a mouse, plus tools we can learn as we go. It is free to download and use. Its desktop has no built-in advertising. [Fedora Workstation](https://fedoraproject.org/workstation/)

I like that starting point. I want to open my work and learn how my computer behaves.

Fedora also includes a security tool called **SELinux**. It adds rules that limit what certain programs can do. Think of giving a worker keys to the rooms needed for a job. That can help limit the harm if something goes wrong. Fedora enables SELinux by default. [Fedora security features](https://fedoraproject.org/wiki/Security_Features)

Fedora still needs updates. Some games, school apps, or devices may need extra work or may not work with it. Before switching a real computer, check the things you need with someone who can help.

My preference is Fedora for exploring and learning. The right choice for your own computer also depends on what you need to run.

## 10. Where apps come from

To draw our cat, we need a drawing app.

On Fedora, the Software app helps you find and install software. A software **repository** is a place that provides packages for your computer. A package holds software and the information needed to install it.

The source matters. An app from Fedora's own collection and an app from another provider may follow different rules. Check where an app comes from, even when both appear in the same software store. Fedora Workstation supports software from Fedora repositories and other sources such as Flathub. [Fedora Workstation](https://fedoraproject.org/workstation/)

When an app asks for permission, pause to think about its job.

A video call may need the camera. A simple drawing app usually has no reason to ask for your contacts, the names and details you save about other people.

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

A service might protect your password well and still collect lots of information about what you do. So we need to ask about both.

Linux can get harmful software too. Fedora's protections help, but no operating system makes every download safe.

Windows and macOS also include tools that check for harmful software and help protect the computer. [Windows Security](https://support.microsoft.com/en-us/windows/security/windows-security/stay-protected-with-the-windows-security-app), [Apple's app security guide](https://support.apple.com/guide/deployment/dep323ab8aa3/web)

**Pause and think:** A company keeps your account secure but uses your activity to choose ads. Can there still be a privacy question?

**Answer:** Yes. Protecting the account and deciding how its information gets used are different questions.

## 12. What information can a computer send?

Your computer can send different kinds of information for different reasons.

An update check may tell a server which system version you use so it can offer the right update. A **server** is another computer that provides a service over a network.

A **diagnostic report** describes how software or a device is working. It might say that an app crashed. A crash means the app stopped working unexpectedly.

Some reports describe which features people use. You may hear this kind of automatic reporting called **telemetry**.

Other services may receive your searches, the videos you watch, or files you upload. That tells a different story about you from a report saying which system version you have.

The amount of data alone does not tell us how private something is. One tiny message containing your home address can matter more than a much larger list of technical errors.

Before sharing, ask: What is going? Who gets it? What will they use it for? Can I choose?

## 13. What Windows, macOS, and Fedora send

Different computers send different amounts of information. It depends on the system, its settings, the apps, and what you do. There is no single daily amount for all Windows, Mac, or Fedora computers. We can compare the kinds of information and the choices you have.

### Windows

On an ordinary Windows 11 home computer, Windows sends required diagnostic information to Microsoft. It includes details about the device, its settings, and how well it is working.

Optional reports can add more detail about app use and activity. They can include browsing information and richer crash reports. A crash report can sometimes include bits of what was in memory when the problem happened.

You can turn optional diagnostics off. Required diagnostics and information used by connected services can still be sent. These are separate controls. [Microsoft's diagnostics explanation](https://support.microsoft.com/en-us/windows/privacy/diagnostics-feedback-and-privacy-in-windows), [Windows connected services](https://support.microsoft.com/en-us/windows/experience/essential-services-and-connected-experiences-for-windows)

### macOS

Apple calls its reports **analytics**. It says Mac analytics are sent with your permission. They can describe the computer's parts, its software, crashes, and how features are used.

You can review sharing in **System Settings, then Privacy & Security, then Analytics & Improvements**. Turning analytics off does not turn off every online service. Sharing a file through iCloud, for example, is a separate activity. [Apple's Mac analytics guide](https://support.apple.com/guide/mac-help/share-analytics-information-mac-apple-mh27990/mac)

### Fedora

Fedora also sends some information.

Its update system has a feature called **countme**. It helps count systems using details such as the Fedora version and roughly how long it has been installed on a computer. Think of tally marks showing how many systems are checking for updates. This counting feature does not send the contents of your cat picture or a list of every app you open.

The servers handling these requests can still record an IP address and a time. An **IP address** helps computers send messages to the right place, a little like a return address on a letter. Several devices can share one public IP address. Fedora publishes combined counts, rather than those raw connection logs. [Fedora's countme implementation](https://github.com/fedora-infra/mirrors-countme)

Crash reporting and the apps you install are separate. A crash report may include more detail, so check what you are sharing. [Fedora's crash reporting service](https://abrt.fedoraproject.org/)

**Pause and think:** If you turn off optional system reports, have you stopped every app and website from collecting data?

**Answer:** No. Apps, websites, and online accounts have their own settings and behavior.

## 14. Our picture goes online

Let's return to the cat.

You save it in a folder on your computer that does not copy files online automatically. Saving the file does not, by itself, require an upload.

Then you choose to **upload** it to a website. Uploading means sending a copy from your computer to another computer over a network. Now that website receives your picture.

If you upload it while signed in, the website can connect the action with your account. Using Fedora does not hide that connection.

The same idea applies to videos. A video service can record which videos your signed-in account watches, whatever operating system you use.

Your operating system, browser, websites, and other apps are different places to check. A browser is an app too, with its own data settings. [Firefox's privacy notice](https://www.mozilla.org/en-US/privacy/firefox/)

Changing the operating system can change some choices. Your choices inside apps and websites still matter.

**Try this:** You draw a picture, then upload it to a class website. At which step does the website get the picture?

**Answer:** When you upload it. If an app or folder uploads automatically, it can send the picture earlier, so check its sync settings too.

## 15. Small habits that help

You do not need to be a computer expert to make useful choices.

Install updates. They often repair mistakes, including security problems.

Get apps from sources you trust, and check the source before installing. A random pop-up saying your computer is broken is a reason to stop and ask for help.

Use a different password for each account, and make it long and hard to guess. A password manager can help keep track of them. Some accounts offer a second sign-in step, such as a code from another app. A trusted adult can help you set that up.

Give apps only the access they need. Take a moment before allowing the camera, microphone, location, or files.

Keep a **backup**, an extra copy of important work somewhere separate. If the computer breaks or a file gets deleted, the extra copy may save your picture.

If something feels wrong, ask for help. Accidentally clicking a strange link is something to fix, not something you need to hide.

## 16. A small Linux-style experiment

Our presentation includes a pretend desktop called **opitlcalOS**. It runs inside a web page. It borrows ideas from Linux desktops, but it is a teaching model, not a real Fedora installation. Its files and system numbers are pretend.

If you have the presentation open, try this:

1. Open **Files**, then open the **Documents** folder. Find `notes.txt`.
2. Open **Terminal**.
3. Type `ls /home/student/Documents` and press Enter. This asks for the names in that folder.
4. Type `cat /home/student/Documents/notes.txt` and press Enter. This asks to read the text file.

You have used a window and typed commands to explore the same pretend files. These commands only list names and read text.

If you are reading this manuscript alone, picture the result: the folder window shows `notes.txt`, and the terminal can show its name and contents too. You have learned the same idea without needing the demo.

On a real computer, commands can also change or delete things. Ask what an unfamiliar command does before copying it.

## 17. Back to the blue cat

At the start, you opened an app, drew a cat, and saved it.

Now you can explain a little more of the story.

The processor followed instructions. RAM held working data. The operating system helped the app use those resources. Saving kept the picture in storage.

Linux can be the kernel inside that system. Fedora brings Linux and other software together. GNOME gives Fedora Workstation its desktop.

When you share the picture, someone else receives information. Security helps protect it. Privacy asks who gets it and how they use it.

I like Fedora because it gives me room to explore and learn. You can start much smaller than changing your whole computer: open a folder, check an app's permissions, or find out what one setting means.

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
- The presentation now follows this manuscript in English and Mongolian, with 17 chapters, eight review questions, and a Read along view containing the full narration. Its language toggle keeps technical terms such as RAM, CPU, and kernel in English in the Mongolian version.
