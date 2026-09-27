import generatedManuscript from "./presentation-manuscript.generated.json";

export type Language = "en" | "mn";

export type Manuscript = {
  title: string;
  intro: string;
  sections: Array<{ id: number; title: string; markdown: string }>;
  quiz: Array<{ question: string; answer: string }>;
  notes: string;
};

export const manuscript: Record<Language, Manuscript> = generatedManuscript;

export type SlideCopy = {
  eyebrow: string;
  title: string;
  summary: string;
  takeaway: string;
};

export const slideCopy: Record<Language, SlideCopy[]> = {
  en: [
    {
      eyebrow: "Start with a drawing",
      title: "You draw.\nThe OS helps.",
      summary: "A blue brush. A song playing. A picture to save. The operating system helps the apps use your computer.",
      takeaway: "An app does a job. The OS helps it use the computer's parts.",
    },
    {
      eyebrow: "Meet the parts",
      title: "RAM is for now.\nStorage is for later.",
      summary: "The drawing app uses RAM as working space. Saving puts your picture in storage. The CPU follows the program's instructions.",
      takeaway: "Save the cat to storage so you can open it tomorrow.",
    },
    {
      eyebrow: "Sharing the work",
      title: "How can you draw\nand play music?",
      summary: "The OS gives running programs quick turns using the CPU. Different parts of a CPU, called cores, can also work at the same time.",
      takeaway: "A running program is a process. It needs CPU time and RAM.",
    },
    {
      eyebrow: "Follow cat.png",
      title: "What happens\nwhen you press Save?",
      summary: "The app asks the OS to put your picture's information into a file. The OS checks whether it is allowed, then works with storage.",
      takeaway: "A folder organizes files. A driver helps the system work with a device.",
    },
    {
      eyebrow: "The parts of an OS",
      title: "The desktop is\none part of the OS.",
      summary: "You click windows and buttons on the desktop. The kernel helps share CPU time, manage RAM, and control access to devices.",
      takeaway: "A terminal is where you type commands. A shell is the program that reads them.",
    },
    {
      eyebrow: "Different systems",
      title: "Different systems.\nThe same basic jobs.",
      summary: "You can draw and save a picture on Windows, macOS, or a Linux-based system. The buttons and available apps may differ.",
      takeaway: "We will explore Linux and Fedora. You do not need to change your computer.",
    },
    {
      eyebrow: "Three names to know",
      title: "Linux, Fedora,\nand GNOME.",
      summary: "Linux is a kernel. Fedora combines it with other software to make a complete system. GNOME supplies Fedora Workstation's desktop.",
      takeaway: "Fedora is the distribution, or distro. Our example, Fedora Workstation, uses GNOME.",
    },
    {
      eyebrow: "Read the recipe",
      title: "You can read\nthe source code.",
      summary: "Source code is the written instructions used to make software, a little like a recipe. Linux lets people read, change, and share its code under its license.",
      takeaway: "A license sets the rules for using the code. Open code can still contain mistakes, called bugs.",
    },
    {
      eyebrow: "Our example system",
      title: "Why I like\nFedora.",
      summary: "Fedora gives us a desktop to explore without built-in ads. Its SELinux tool adds rules that limit what certain programs can do.",
      takeaway: "Fedora still needs updates. Check that your apps and devices work before switching.",
    },
    {
      eyebrow: "Before you install",
      title: "Where did\nthis app come from?",
      summary: "Two apps in Fedora's Software store can come from different places. Check who provides an app and whether it needs the access it asks for.",
      takeaway: "A video call may need your camera. A drawing app usually has no reason to ask for your contacts.",
    },
    {
      eyebrow: "Two different questions",
      title: "Is it protected?\nWho gets to see it?",
      summary: "Security helps protect your picture and account. Privacy asks what information is collected, who gets it, and how it is used.",
      takeaway: "An account can be well protected while the service still collects information about what you do.",
    },
    {
      eyebrow: "Follow the information",
      title: "What information\nleaves the computer?",
      summary: "An update check may send your system version. A crash report describes a problem. Sending your picture shares the picture itself.",
      takeaway: "Ask what is sent, who receives it, why they need it, and whether you can choose.",
    },
    {
      eyebrow: "Windows · macOS · Fedora",
      title: "What do these\nsystems send?",
      summary: "Windows sends required reports, with optional extras. Mac analytics are sent with permission. Fedora's countme helps count systems checking for updates.",
      takeaway: "No single daily amount fits every computer. Apps, websites, and other reports need checking too.",
    },
    {
      eyebrow: "The cat goes online",
      title: "An upload\nsends a copy.",
      summary: "Saving locally can keep your picture on your computer. Uploading sends a copy to a website. Sync can do that automatically.",
      takeaway: "Fedora does not hide which account you signed in to.",
    },
    {
      eyebrow: "Small habits",
      title: "Small habits help\nprotect your work.",
      summary: "Install updates, check where apps come from, and give them only the access they need. Use different passwords and keep a backup: an extra copy stored separately.",
      takeaway: "If something feels wrong, ask for help. You do not have to hide a mistake.",
    },
    {
      eyebrow: "Try it in opitlcalOS",
      title: "Read the same file\ntwo different ways.",
      summary: "Find notes.txt in Files. In Terminal, ls lists the folder's contents and cat reads the file. Both show the same pretend files.",
      takeaway: "This desktop is a teaching model. Its files and system numbers are pretend.",
    },
    {
      eyebrow: "Back to the blue cat",
      title: "Your computer.\nYour choices.",
      summary: "The CPU followed instructions. RAM held the work. Storage kept your picture. The OS helped the parts work together.",
      takeaway: "Your next click can be a choice you understand.",
    },
  ],
  mn: [
    {
      eyebrow: "Нэг зургаас эхэлье",
      title: "Чи зурна.\nOS тусална.",
      summary: "Цэнхэр бийрээр зурна. Хөгжим сонсоно. Зургаа хадгална. OS аппуудад компьютерийн эд ангийг ашиглахад тусална.",
      takeaway: "Апп тодорхой ажил хийнэ. OS түүнд компьютерийн эд ангийг ашиглахад тусална.",
    },
    {
      eyebrow: "Компьютерийн хэсгүүд",
      title: "RAM-д ажиллана.\nStorage-д хадгална.",
      summary: "Зурах үед хэрэгтэй мэдээлэл RAM-д байна. Save дарахад зураг storage-д хадгалагдана. CPU аппын зааврыг биелүүлнэ.",
      takeaway: "Муурын зургаа маргааш нээхийн тулд storage-д хадгалаарай.",
    },
    {
      eyebrow: "CPU-ийн ажлыг хуваах нь",
      title: "Хоёр апп.\nБогино ээлжүүд.",
      summary: "OS аппуудад CPU ашиглах богино ээлж өгдөг. CPU-ийн core гэж нэрлэдэг боловсруулах хэсгүүд зарим ажлыг зэрэг хийж чадна.",
      takeaway: "Ажиллаж байгаа программ бол process. Түүнд CPU-ийн хугацаа, RAM-ын зай хэрэгтэй.",
    },
    {
      eyebrow: "cat.png файлыг хадгалъя",
      title: "Save дарахад\nюу болдог вэ?",
      summary: "Апп OS-оос файлыг хадгалахыг хүснэ. OS зөвшөөрлийг шалгаад storage төхөөрөмжтэй ажиллаж зургийг хадгална.",
      takeaway: "Folder файлуудыг цэгцэлнэ. Driver нь OS-ийг төхөөрөмжтэй харилцахад тусална.",
    },
    {
      eyebrow: "Desktop-ийн цаана",
      title: "Desktop бол\nOS-ийн нэг хэсэг.",
      summary: "Desktop дээр цонх, товч ашиглана. Kernel нь CPU-ийн хугацаа, RAM-ын зай, төхөөрөмжид хандах эрхийг зохицуулна.",
      takeaway: "Terminal бол команд бичих цонх. Shell тэр командыг уншиж, ажлыг эхлүүлнэ.",
    },
    {
      eyebrow: "Өөр өөр системүүд",
      title: "Төстэй ажил.\nӨөр өөр систем.",
      summary: "Windows, macOS, Linux дээр тулгуурласан системүүдэд зураг зурж, хадгалж болно. Харин товч, цэс, ашиглаж болох апп нь ялгаатай.",
      takeaway: "Бид Linux, Fedora-г дэлгэрэнгүй үзнэ. Үүнийг ойлгохын тулд OS-оо солих хэрэггүй.",
    },
    {
      eyebrow: "Гурван нэрийг ялгая",
      title: "Linux, Fedora,\nGNOME.",
      summary: "Linux бол kernel. Fedora түүнийг бусад программтай нэгтгэж бүрэн систем болгоно. GNOME нь Fedora Workstation-ийн desktop орчныг бүрдүүлнэ.",
      takeaway: "Fedora бол distribution буюу distro. Бидний жишээ Fedora Workstation нь GNOME ашигладаг.",
    },
    {
      eyebrow: "Программын жорыг харъя",
      title: "Кодыг нь үзэж,\nөөрчилж болно.",
      summary: "Source code бол программ бүтээхээр бичсэн заавар. Энэ нь жортой төстэй. Linux-ийн кодыг license-ийнх нь дагуу уншиж, өөрчилж, хуваалцаж болно.",
      takeaway: "License нь кодыг ашиглах дүрмийг заана. Нээлттэй кодод ч bug буюу алдаа байж болно.",
    },
    {
      eyebrow: "Суралцахад сонгосон нь",
      title: "Би яагаад\nFedora-д дуртай вэ?",
      summary: "Fedora-ийн desktop-ийг өөрөө судалж болно. Desktop-д суулгасан зар байхгүй. SELinux зарим программын хийж болох үйлдлийг хязгаарлана.",
      takeaway: "Fedora-д ч шинэчлэлт хэрэгтэй. Солихоосоо өмнө хэрэгтэй апп, төхөөрөмж чинь ажиллах эсэхийг шалгаарай.",
    },
    {
      eyebrow: "Суулгахаасаа өмнө",
      title: "Энэ апп\nхаанаас ирсэн бэ?",
      summary: "Fedora-ийн Software аппад өөр өөр эх сурвалжийн апп бий. Хаанаас ирснийг нь шалга. Дараа нь хүссэн зөвшөөрөл нь ажилд нь хэрэгтэй эсэхийг бод.",
      takeaway: "Дүрст дуудлагад камер хэрэгтэй. Харин энгийн зургийн аппад contacts хэрэгтэй юу?",
    },
    {
      eyebrow: "Хоёр өөр асуулт",
      title: "Хамгаалагдсан уу?\nМэдээллийг хэн авах вэ?",
      summary: "Аюулгүй байдал зураг, бүртгэлийг хамгаална. Нууцлал нь ямар мэдээллийг хэн авч, юунд ашиглаж байгаатай холбоотой.",
      takeaway: "Бүртгэл сайн хамгаалагдсан ч тухайн үйлчилгээ хийсэн үйлдлийн чинь тухай мэдээлэл цуглуулж болно.",
    },
    {
      eyebrow: "Компьютерээс гарч буй мэдээлэл",
      title: "Юу илгээх вэ?\nХэн авах вэ?",
      summary: "Шинэчлэлт шалгахад системийн хувилбар, crash report-д алдааны мэдээлэл, upload хийхэд зургийн хуулбар явж болно.",
      takeaway: "Юу илгээх вэ? Хэн авах вэ? Юунд ашиглах вэ? Би өөрөө сонгож болох уу?",
    },
    {
      eyebrow: "Windows · macOS · Fedora",
      title: "Юу илгээдэг вэ?\nЮуг тохируулж болох вэ?",
      summary: "Windows-д required, optional diagnostics бий. Mac analytics зөвшөөрөлтэй илгээгдэнэ. Fedora-ийн countme шинэчлэлт шалгаж буй системүүдийг тоолоход тусална.",
      takeaway: "Бүх компьютерт таарах өдрийн нэг хэмжээ байхгүй. Апп, вэбсайт, бусад тайланг ч тусад нь шалгана.",
    },
    {
      eyebrow: "Муурын зураг интернэтэд",
      title: "Upload хийхэд\nхуулбар явна.",
      summary: "Компьютер дээрээ хадгалах, вэбсайтад upload хийх хоёр өөр үйлдэл. Sync идэвхтэй бол зураг автоматаар интернэтэд хуулж болно.",
      takeaway: "Нэвтэрсэн үедээ upload хийвэл вэбсайт үүнийг бүртгэлтэй чинь холбож чадна. Fedora энэ холбоог нуухгүй.",
    },
    {
      eyebrow: "Тустай жижиг дадлууд",
      title: "Зургаа хамгаалах\nжижиг алхмууд.",
      summary: "Шинэчлэлт суулга. Аппын эх сурвалж, зөвшөөрлийг шалга. Бүртгэл бүрд өөр нууц үг хэрэглэ. Чухал файлаа тусдаа газар давхар хадгалахыг backup гэдэг.",
      takeaway: "Ямар нэг зүйл буруу санагдвал тусламж хүсээрэй. Алдаагаа нуух хэрэггүй.",
    },
    {
      eyebrow: "opitlcalOS дээр туршъя",
      title: "Нэг файл.\nХарах хоёр арга.",
      summary: "Files дотроос notes.txt-ийг ол. Terminal-д ls нь folder доторх нэрсийг, cat нь тэр файлын бичвэрийг харуулна.",
      takeaway: "Энэ desktop бол сургалтын загвар. Файл, системийн тоон үзүүлэлтүүд нь зохиомол.",
    },
    {
      eyebrow: "Цэнхэр муур руугаа буцъя",
      title: "Чиний компьютер.\nЧиний сонголт.",
      summary: "CPU зааврыг биелүүлсэн. RAM зурах үед хэрэгтэй мэдээллийг байлгасан. Save дарахад зураг storage-д хадгалагдсан. OS эдгээр ажлыг зохицуулахад тусалсан.",
      takeaway: "Дараагийн удаа товч дарахдаа юу болохыг нь ойлгож сонгоорой.",
    },
  ],
};
