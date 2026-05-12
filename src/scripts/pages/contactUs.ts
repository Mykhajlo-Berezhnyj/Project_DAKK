import { Crisp } from "crisp-sdk-web";
import { CASHE_TTL } from "../service/getCashed";
import { getStorage } from "../utils/getStorage";
import { setStorage } from "../utils/setStorage";

type Mode = "call" | "chat" | "alarm" | null;

type UserBase = {
  name: string;
  email: string;
  phone: string;
};

type User = UserBase & {
  timeLastActive: number;
};

type ErrorsForm = {
  name: string;
  email: string;
  phone: string;
};

type Alarm = {
  timeLastAlarm: number;
  timing: number;
  active: boolean;
};

interface ContactUs {
  user: User;
  message: string;
  timeLastMessage: number;
  timeLastSend: number;
  alarm: Alarm;
  mode: Mode;
  initialized: boolean;
  actionsOpen: boolean;
  formOpen: boolean;
  chatOpened: boolean;
  isloading: boolean;
  requestId: number | null;
  error: string;
  errorsForm: ErrorsForm;
  messageOk: string;
  clickTimeout: number | null;
  pressTimer: number | null;
  longerPress: boolean;
  revers: boolean;
  init: () => void;
  validationForm: () => boolean;
  submitForm: () => void;
  sendForm: (alarm?: boolean, retry?: number) => void;
  identityUser: () => Partial<User> | null;
  refreshUser: () => void;
  getUserThisCrisp: () => Partial<UserBase> | null;
  getAlarm: () => boolean;
  initCrisp: () => void;
  openCrisp: () => void;
  sendContact: () => void;
  openChat: () => void;
  closeChat: () => void;
  togleChat: () => void;
  sendAlarm: () => void;
  checkAlarm: () => void;
  adaptiveClick: () => void;
  saveRevers: () => void;
  startPress: () => void;
  endPress: () => void;
}

export function contactUs(): ContactUs {
  return {
    user: {
      name: "",
      phone: "",
      email: "",
      timeLastActive: 0,
    },
    message: "",
    timeLastMessage: 0,
    timeLastSend: 0,
    alarm: {
      timeLastAlarm: 0,
      timing: 0,
      active: true,
    },
    mode: null as Mode,
    initialized: false,
    actionsOpen: false,
    formOpen: false,
    chatOpened: false,
    isloading: false,
    requestId: null,
    error: "",
    errorsForm: {
      name: "",
      email: "",
      phone: "",
    },
    messageOk: "",
    clickTimeout: null,
    pressTimer: null,
    longerPress: false,
    revers: true,

    init() {
      const activate = async () => {
        if (window.scrollY > 150) {
          window.removeEventListener("scroll", activate);
          window.removeEventListener("touchstart", activate);
          window.removeEventListener("mousemove", activate);
          await this.initCrisp();
        }
        const timeLastAlarm = getStorage("contact-alarm");
        if (timeLastAlarm && typeof timeLastAlarm === "number") {
          this.alarm.timeLastAlarm = timeLastAlarm;
          this.checkAlarm();
        }

        const timeLastMessage = getStorage("contact-lastMessage");
        if (timeLastMessage && typeof timeLastMessage === "number") {
          this.timeLastMessage = timeLastMessage;
        } else {
          localStorage.removeItem("contact-lastMessage");
        }

        const timeLastSend = getStorage("contact-timeLastSend");
        if (timeLastSend && typeof timeLastSend === "number") {
          this.timeLastSend = timeLastSend;
        } else {
          localStorage.removeItem("contact-timeLastSend");
        }
      };
      window.addEventListener("scroll", activate);
      window.addEventListener("touchstart", activate, {
        passive: true,
        once: true,
      });
      window.addEventListener("mousemove", activate, {
        passive: true,
        once: true,
      });
    },

    validationForm() {
      this.errorsForm = {
        name: "",
        email: "",
        phone: "",
      };

      let valid = true;

      if (this.user.name.trim().length < 2) {
        this.errorsForm.name = "Ім'я повинно містити не менше 2 символів";
        valid = false;
      }

      if (
        this.user.email.trim() &&
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
          this.user.email,
        )
      ) {
        this.errorsForm.email = "невірний формат email";
        valid = false;
      }

      const validPhone = /^(?:\+380[0-9]{9}|0[0-9]{9})$/.test(this.user.phone);

      if (!validPhone) {
        this.errorsForm.phone = "Невірний формат телефону";
        valid = false;
      }
      return valid;
    },

    submitForm() {
      if (!this.validationForm()) return;

      console.log("name:", this.user.name);
      if (this.mode === "chat") {
        Crisp.chat.show();
        this.formOpen = false;
        this.openCrisp();
      }
      this.requestId = Date.now();

      this.sendForm();
    },

    async sendForm(alarm = false, retry = 0) {
      const url = "/api/contacts";
      if (this.isloading) return;
      try {
        let type;
        if (this.mode === "chat") {
          type = "Чат";
        } else if (this.mode === "alarm") {
          type = "Очікую в чаті";
        } else {
          type = "Дзвінок/телеграм";
        }
        this.isloading = true;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: this.requestId,
            name: this.user.name,
            phone: this.user.phone,
            email: this.user.email,
            message: this.message,
            type,
          }),
        });

        if (!response.ok) {
          if (retry <= 5) {
            if (retry === 0) {
              this.error =
                "Не вдалося відправити, спробуйте пізніше, а зараз можете задати свої питаня в чаті ";
            }
            console.log("🚀 ~ contactUs ~retry:", retry);

            this.isloading = false;
            setTimeout(() => {
              this.sendForm(alarm, retry + 1);
            }, 3000);
            if (retry !== 0) return;
          }
          throw new Error(
            "Досягнено максимального числа повторних спроб надсилання",
          );
        }

        if (this.mode === "alarm") {
          this.alarm.timeLastAlarm = Date.now();
          setStorage("contact-alarm", this.alarm.timeLastAlarm);
        } else if (this.mode === "call") {
          this.timeLastSend = Date.now();
          setStorage("contact-timeLastSend", this.timeLastSend);
        }

        this.refreshUser();

        if (this.mode === "call") {
          this.messageOk = "✔️ Дякуємо, невдовзі ми зв'яжемося з Вами";
        } else if (this.mode === "alarm") {
          this.messageOk = "✔️ Сигнал оператору наділано";
        } else {
          Crisp.chat.show();
          Crisp.chat.open();
        }
        this.message = "";
        setTimeout(() => {
          this.messageOk = "";
        }, 3000);
        this.requestId = null;
      } catch (error) {
        console.error(error);

        if (retry === 0) {
          Crisp.chat.show();
          this.openCrisp();
          this.error = alarm
            ? "Не вдалося відправити дзвінок оператору, залишайтеся в чаті, попробуйте пізніше"
            : "Не вдалося відправити форму, тому ми перевели вас у чат для зв’язку з нами.";
          Crisp.message.send("text", this.error);

          setTimeout(() => {
            this.error = "";
          }, 3000);
        }
        if (retry >= 5) {
          this.mode = "chat";
          this.requestId = null;
        }
        console.log("🚀 ~ contactUs ~ .this.requestId:", this.requestId);
      } finally {
        if (retry === 0) {
          this.actionsOpen = false;
          this.formOpen = false;
          const reversFromCashe = getStorage("contact-revers");
          if (reversFromCashe && typeof reversFromCashe === "boolean") {
            return (this.revers = reversFromCashe);
          }
          this.mode === "chat" && (this.revers = false);
        }
      }
      this.isloading = false;
    },

    initCrisp() {
      if (!window.$crisp) {
        window.$crisp = [];
      }
      Crisp.configure(import.meta.env.VITE_CRISP_WEBSITE_ID);
      window.$crisp.push([
        "on",
        "chat:opened",
        () => {
          this.chatOpened = true;
          console.log("🚀 ~ contactUs ~ this.chatOpened:", this.chatOpened);
        },
      ]);

      window.$crisp.push([
        "on",
        "chat:closed",
        () => {
          this.chatOpened = false;
          console.log("🚀 ~ contactUs ~ this.chatOpened:", this.chatOpened);
        },
      ]);

      window.$crisp.push([
        "on",
        "message:sent",
        () => {
          this.timeLastMessage = Date.now();
          this.user.timeLastActive = this.timeLastMessage;
          setStorage("contact-timeLastMessage", this.timeLastMessage);
          this.refreshUser();
          console.log(
            "🚀 ~ contactUs--push ~ this.timeLastMessage:",
            this.timeLastMessage,
          );
        },
      ]);

      window.$crisp.push([
        "on",
        "session:loaded",
        () => {
          this.refreshUser();
        },
      ]);

      Crisp.chat.hide();
      Crisp.chat.close();
      this.initialized = true;
    },

    identityUser() {
      if (
        this.user.name.trim() !== "" &&
        this.user.phone.trim() !== "" &&
        Date.now() - this.user.timeLastActive < CASHE_TTL
      ) {
        return this.user;
      } else {
        const user = getStorage("contact-user") as User;
        console.log("🚀 ~ contactUs getStorage ~ user:", user);
        if (
          typeof user?.timeLastActive === "number" &&
          Date.now() - user?.timeLastActive < CASHE_TTL
        ) {
          this.user = user;
          return user;
        } else {
          localStorage.removeItem("contact-user");
          const user = this.getUserThisCrisp();
          if (!user) return null;
          this.user = { ...this.user, ...user };
          return this.user;
        }
      }
    },

    getUserThisCrisp() {
      const user = {
        name: Crisp.user.getNickname() || "",
        email: Crisp.user.getEmail() || "",
        phone: Crisp.user.getPhone() || "",
      };
      console.log("getUserThisCrisp ~user:", user);

      if (user.name?.trim() && user.phone?.trim()) {
        return user;
      } else {
        return null;
      }
    },

    refreshUser() {
      const user = this.identityUser();
      console.log("🚀 ~ contactUs~refreshUser ~ user:", user);
      if (!user) return;

      if (user.name?.trim() && user.phone?.trim()) {
        this.user = { ...this.user, ...user, timeLastActive: Date.now() };
        setStorage("contact-user", this.user);
      }
    },

    openChat() {
      this.mode = "chat";
      this.actionsOpen = false;

      const user = this.identityUser();
      console.log(
        "🚀 ~ contactUs ~  this.user.timeLastActive:",
        this.user.timeLastActive,
      );
      if (!user) {
        this.formOpen = true;
      } else if (Date.now() - this.user.timeLastActive > 2 * 60 * 60 * 1000) {
        this.formOpen = true;
      } else {
        Crisp.chat.show();
        Crisp.chat.open();
      }
    },

    closeChat() {
      Crisp.chat.close();
      this.actionsOpen = false;
    },

    togleChat() {
      this.chatOpened ? this.closeChat() : this.openChat();
    },

    sendContact() {
      if (this.requestId) return;
      if (Date.now() - this.timeLastSend < 2 * 60 * 60 * 1000) {
        this.messageOk =
          "⚠️ Дякую Ви вже відправили контакти, ми зв'яжемося з Вами якнайшвидше";

        setTimeout(() => {
          this.messageOk = "";
        }, 3500);
        return;
      }
      this.formOpen = true;
      this.actionsOpen = false;
      this.mode = "call";
    },

    getAlarm() {
      return Date.now() - this.alarm.timeLastAlarm > 10 * 60 * 1000;
    },

    async sendAlarm() {
      const user = this.identityUser();

      if (user) {
        console.log("🚀 ~ sendAlarm ~ this.user:", this.user);
        this.mode = "alarm";
        this.requestId = Date.now();
        await this.sendForm(true);
        console.log(
          "🚀 ~ sendAlarm ~ this.timeLastAlarm:",
          this.alarm.timeLastAlarm,
        );
        this.checkAlarm();
      } else {
        this.formOpen = true;
      }
    },

    checkAlarm() {
      // if (this.timeLastAlarm === 0) return;
      const diff = Date.now() - this.alarm.timeLastAlarm;
      console.log(
        "🚀 ~ checkAlarm ~ this.timeLastAlarm:",
        this.alarm.timeLastAlarm,
      );
      const timing = (10 * 60 * 1000 - diff) / 1000;

      if (timing <= 0) {
        this.alarm.active = true;
        this.alarm.timing = 0;
      } else {
        this.alarm.active = false;
        this.alarm.timing = Math.ceil(timing);
        setTimeout(() => this.checkAlarm(), 1000);
      }
    },

    openCrisp() {
      Crisp.user.setNickname(this.user.name);

      const localPhone = this.user.phone.replace(/\D/g, "");
      const emailLocal =
        this.user.email?.trim() || `contact_${localPhone}@example.com`;
      console.log("🚀 ~ contactUs ~ emailLocal:", emailLocal);
      Crisp.user.setEmail(emailLocal);
      Crisp.user.setPhone(localPhone);
      Crisp.session.setData({
        phone: localPhone,
        email: emailLocal,
        message: this.message,
      });
      Crisp.chat.open();
    },

    adaptiveClick() {
      if (this.pressTimer) {
        this.longerPress = false;
        return;
      }

      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
        this.revers
          ? this.togleChat()
          : (this.actionsOpen = this.actionsOpen ? false : true);
        return;
      }

      this.clickTimeout = window.setTimeout(() => {
        this.revers ? (this.actionsOpen = !this.actionsOpen) : this.togleChat();
        this.clickTimeout = null;
        return;
      }, 250);
    },

    saveRevers() {
      console.log("🚀 ~ saveRevers ~ this.revers:", this.revers);
      setStorage("contact-revers", this.revers);
    },

    startPress() {
      this.longerPress = false;
      this.pressTimer = window.setTimeout(() => {
        this.longerPress = true;
        this.revers
          ? this.togleChat()
          : (this.actionsOpen = this.actionsOpen ? false : true);
      }, 600);
    },

    endPress() {
      if (this.pressTimer) {
        clearTimeout(this.pressTimer);
        this.pressTimer = null;
      }
    },
  };
}
