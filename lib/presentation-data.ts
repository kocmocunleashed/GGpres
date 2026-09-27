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
      title: "Room to work.\nA place to keep it.",
      summary: "RAM holds what apps are working with now. Storage keeps saved files. The CPU follows instructions.",
      takeaway: "Save the cat to storage so you can open it tomorrow.",
    },
    {
      eyebrow: "Sharing the work",
      title: "Draw a little.\nPlay a little.",
      summary: "The OS gives running programs turns. Those turns can be so quick that the drawing and music seem to happen together.",
      takeaway: "A running program is a process. Some work can also happen on different CPU cores.",
    },
    {
      eyebrow: "Follow cat.png",
      title: "Save is\na request.",
      summary: "The app asks the OS to write your picture. The OS checks permission and works with the storage device.",
      takeaway: "A folder organizes files. A driver helps the system work with a device.",
    },
    {
      eyebrow: "Under the desktop",
      title: "Some parts\nyou can see.",
      summary: "The desktop has windows and buttons. The kernel helps manage resources underneath. A terminal gives you a place to type commands.",
      takeaway: "A shell reads your commands. You can learn Linux with a mouse, too.",
    },
    {
      eyebrow: "Different systems",
      title: "Similar jobs.\nDifferent choices.",
      summary: "Windows, macOS, and Linux-based systems all help apps use a computer. Their controls and included software differ.",
      takeaway: "We will explore Linux and Fedora. You do not need to change your computer.",
    },
    {
      eyebrow: "Three names to know",
      title: "Linux inside.\nFedora together.",
      summary: "Linux is the kernel. Fedora brings it together with other software. GNOME provides Fedora Workstation's desktop.",
      takeaway: "Kernel: Linux. Distribution: Fedora. Desktop: GNOME.",
    },
    {
      eyebrow: "Read the recipe",
      title: "You can see\nhow it works.",
      summary: "Source code is the instructions people write to make software. Open software lets people study, change, and share it under its license.",
      takeaway: "Open code gives people a way to check. It can still have bugs.",
    },
    {
      eyebrow: "Our choice for learning",
      title: "Why I like\nFedora.",
      summary: "A desktop to explore. No built-in desktop ads. SELinux adds rules that help limit what programs can do.",
      takeaway: "Fedora still needs updates. Check that your apps and devices work before switching.",
    },
    {
      eyebrow: "Before you install",
      title: "Where did\nthis app come from?",
      summary: "Fedora's Software app can show apps from different sources. Check the source, then think about the access an app asks for.",
      takeaway: "A drawing app asking for your contacts is a reason to pause.",
    },
    {
      eyebrow: "Two different questions",
      title: "Is it protected?\nWho gets to see it?",
      summary: "Security helps protect your picture and account. Privacy asks what information is collected, who gets it, and how it is used.",
      takeaway: "A secure account can still raise privacy questions. Linux can get harmful software, too.",
    },
    {
      eyebrow: "Information leaving home",
      title: "What is\nbeing sent?",
      summary: "An update check, a crash report, and your uploaded picture tell different stories. A tiny message can hold something very personal.",
      takeaway: "Ask: What goes? Who gets it? Why? Can I choose?",
    },
    {
      eyebrow: "Windows · macOS · Fedora",
      title: "Compare the data.\nCheck the choices.",
      summary: "Windows has required and optional diagnostics. Mac analytics ask for permission. Fedora's countme helps count systems checking for updates.",
      takeaway: "No single daily amount fits every computer. Apps and online services have their own settings.",
    },
    {
      eyebrow: "The cat goes online",
      title: "An upload\nsends a copy.",
      summary: "Saving locally can keep your picture on your computer. Uploading sends a copy to a website. Sync can do that automatically.",
      takeaway: "Fedora does not hide which account you signed in to.",
    },
    {
      eyebrow: "Small habits",
      title: "You can start\nwith one choice.",
      summary: "Install updates. Check app sources and permissions. Use different passwords and keep a separate backup of important work.",
      takeaway: "If something feels wrong, ask for help. You do not have to hide a mistake.",
    },
    {
      eyebrow: "Try it in opitlcalOS",
      title: "One folder.\nTwo ways to look.",
      summary: "Find notes.txt in Files. Then use ls and cat in Terminal to list the same folder and read the same file.",
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
      summary: "Цэнхэр бийр сонгоно. Хөгжим сонсоно. Зургаа хадгална. Аппуудад компьютерээ ашиглахад нь үйлдлийн систем тусалдаг.",
      takeaway: "Апп тодорхой ажил хийнэ. OS түүнд компьютерийн эд ангийг ашиглахад тусална.",
    },
    {
      eyebrow: "Компьютерийн хэсгүүд",
      title: "Ажиллах зай.\nХадгалах газар.",
      summary: "RAM аппын яг одоо ашиглаж буй мэдээллийг байлгана. Storage хадгалсан файлыг үлдээнэ. CPU зааврыг биелүүлнэ.",
      takeaway: "Муурын зургаа маргааш нээхийн тулд storage дээр хадгалаарай.",
    },
    {
      eyebrow: "Ажлаа хуваалцах нь",
      title: "Зурна.\nХөгжим ч явна.",
      summary: "OS ажиллаж байгаа программуудад ээлж өгдөг. Ээлж нь маш богино тул зураг, хөгжим зэрэг ажиллаж байгаа мэт санагдана.",
      takeaway: "Ажиллаж байгаа программыг process гэдэг. CPU-ийн өөр core дээр зарим ажил зэрэг хийгдэж болно.",
    },
    {
      eyebrow: "cat.png файлыг дагая",
      title: "Save дарна.\nХүсэлт явна.",
      summary: "Апп OS-оос зургийг хадгалахыг хүснэ. OS зөвшөөрлийг шалгаад storage төхөөрөмжтэй хамтран ажиллана.",
      takeaway: "Folder файлуудыг цэгцэлнэ. Driver системийг төхөөрөмжтэй ажиллахад тусална.",
    },
    {
      eyebrow: "Desktop-ийн цаана",
      title: "Харагддаг хэсэг.\nЦаана нь kernel.",
      summary: "Desktop дээр цонх, товч бий. Цаана нь kernel нөөцийг зохицуулна. Terminal-д команд бичиж болно.",
      takeaway: "Shell командыг чинь уншина. Linux-ийг хулганаар ашиглаж ч болно.",
    },
    {
      eyebrow: "Өөр өөр системүүд",
      title: "Төстэй ажил.\nӨөр сонголтууд.",
      summary: "Windows, macOS, Linux дээр тулгуурласан системүүд аппуудад компьютер ашиглахад тусална. Удирдлага, дагалдах программ нь ялгаатай.",
      takeaway: "Бид Linux, Fedora хоёрыг үзнэ. Компьютерийнхоо системийг солих шаардлагагүй.",
    },
    {
      eyebrow: "Гурван нэрийг ялгая",
      title: "Linux нь kernel.\nFedora нэгтгэнэ.",
      summary: "Linux бол kernel. Fedora түүнийг бусад программтай нэгтгэнэ. GNOME нь Fedora Workstation-ийн desktop-ийг бүрдүүлнэ.",
      takeaway: "Kernel: Linux. Distro: Fedora. Desktop: GNOME.",
    },
    {
      eyebrow: "Жорыг нь харж болно",
      title: "Яаж ажилладгийг\nнь харж болно.",
      summary: "Source code бол программ бүтээхээр бичсэн заавар. Open source программыг license-ийнх нь дагуу судалж, өөрчилж, хуваалцаж болно.",
      takeaway: "Нээлттэй кодыг шалгаж болно. Гэхдээ bug гарч болдог.",
    },
    {
      eyebrow: "Суралцахад сонгосон нь",
      title: "Би яагаад\nFedora-д дуртай вэ?",
      summary: "Өөрөө судалж болох desktop. Desktop-д суулгасан зар байхгүй. SELinux программуудын хийж болох зүйлийг дүрмээр хязгаарлана.",
      takeaway: "Fedora-д ч шинэчлэлт хэрэгтэй. Солихоосоо өмнө апп, төхөөрөмжүүдээ ажиллах эсэхийг шалгаарай.",
    },
    {
      eyebrow: "Суулгахаасаа өмнө",
      title: "Энэ апп\nхаанаас ирсэн бэ?",
      summary: "Fedora-ийн Software апп дотор өөр өөр эх сурвалжийн апп байж болно. Эх сурвалжийг нь шалгаад, хүссэн зөвшөөрлийг нь бодож үзээрэй.",
      takeaway: "Зургийн апп чиний contacts-ийг харахыг хүсвэл түр зогсоод бодоорой.",
    },
    {
      eyebrow: "Хоёр өөр асуулт",
      title: "Хамгаалагдсан уу?\nХэн харах вэ?",
      summary: "Аюулгүй байдал зураг, бүртгэлийг чинь хамгаалахад тусална. Нууцлал нь ямар мэдээллийг хэн авч, яаж ашиглахтай холбоотой.",
      takeaway: "Бүртгэл хамгаалагдсан ч нууцлалын асуулт үлдэж болно. Linux-д ч хортой программ орж болно.",
    },
    {
      eyebrow: "Мэдээлэл хаашаа явах вэ?",
      title: "Юу\nилгээж байна вэ?",
      summary: "Шинэчлэлт шалгах хүсэлт, crash report, upload хийсэн зураг өөр өөр мэдээлэл өгнө. Жижигхэн зурвас ч хувийн мэдээлэл агуулж болно.",
      takeaway: "Юу явж байна? Хэн авах вэ? Юунд ашиглах вэ? Би сонгож болох уу?",
    },
    {
      eyebrow: "Windows · macOS · Fedora",
      title: "Мэдээллийг харьцуул.\nТохиргоог шалга.",
      summary: "Windows заавал болон сонголтоор тайлан илгээнэ. Mac analytics зөвшөөрөл асууна. Fedora-ийн countme шинэчлэлт шалгаж буй системүүдийг тоолоход тусална.",
      takeaway: "Бүх компьютерт таарах өдрийн нэг хэмжээ байхгүй. Апп, цахим үйлчилгээ тусдаа тохиргоотой.",
    },
    {
      eyebrow: "Муурын зураг интернэтэд",
      title: "Upload хийхэд\nхуулбар явна.",
      summary: "Зургаа компьютер дээрээ хадгалж болно. Upload хийвэл вэбсайтад хуулбар илгээнэ. Sync үүнийг автоматаар хийж болно.",
      takeaway: "Fedora ямар бүртгэлээр нэвтэрснийг чинь вэбсайтаас нуухгүй.",
    },
    {
      eyebrow: "Тустай жижиг дадлууд",
      title: "Нэг сонголтоос\nэхэлж болно.",
      summary: "Шинэчлэлт суулга. Аппын эх сурвалж, зөвшөөрлийг шалга. Өөр өөр нууц үг хэрэглэж, чухал ажлаа тусдаа backup хий.",
      takeaway: "Ямар нэг зүйл буруу санагдвал тусламж хүсээрэй. Алдаагаа нуух хэрэггүй.",
    },
    {
      eyebrow: "opitlcalOS дээр туршъя",
      title: "Нэг хавтас.\nХарах хоёр арга.",
      summary: "Files дотроос notes.txt-ийг ол. Дараа нь Terminal-д ls, cat ашиглаад тэр хавтасны нэрсийг харж, мөн файлыг унш.",
      takeaway: "Энэ desktop бол сургалтын загвар. Файл, системийн тоон үзүүлэлтүүд нь зохиомол.",
    },
    {
      eyebrow: "Цэнхэр муур руугаа буцъя",
      title: "Чиний компьютер.\nЧиний сонголт.",
      summary: "CPU зааврыг биелүүлсэн. RAM ажлын мэдээллийг байлгасан. Storage зургийг үлдээсэн. OS эдгээрийг хамтран ажиллахад тусалсан.",
      takeaway: "Дараагийн удаа товч дарахдаа юу сонгож байгаагаа мэдэж чадна.",
    },
  ],
};
