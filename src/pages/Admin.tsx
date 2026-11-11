import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, ShieldCheck, BellRing, CalendarClock, HeartHandshake, Inbox, Users, Images, Video, CalendarDays, Newspaper, LayoutDashboard, Megaphone, HandCoins, ChevronLeft, ChevronRight, MessageCircle, Phone, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLocalizedText, Language, LocalizedText, TextValue, toLocalizedText, useLanguage } from "@/lib/language";
import { toWhatsAppNumber } from "@/lib/contact";

const languageFieldNames: Record<Language, string> = {
  bn: "বাংলা",
  en: "English",
  hi: "हिन्दी",
};

const LocalizedTextField = ({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: TextValue;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
}) => {
  const localizedValue = toLocalizedText(value);
  const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium text-foreground">{label}</legend>
      {(["bn", "en", "hi"] as const).map((language) => {
        const Input = multiline ? "textarea" : "input";
        return (
          <label key={language} className="grid gap-2 sm:grid-cols-[5.5rem_1fr] sm:items-start">
            <span className="pt-3 text-xs font-medium text-muted-foreground">{languageFieldNames[language]}</span>
            <Input
              value={localizedValue[language]}
              onChange={(event) => onChange({ ...localizedValue, [language]: event.target.value })}
              className={`${inputClass} ${multiline ? "min-h-20" : ""}`}
              placeholder={`${label} — ${languageFieldNames[language]}`}
              {...(multiline ? {} : { type: "text" })}
            />
          </label>
        );
      })}
    </fieldset>
  );
};

const ADMIN_PAGE_SIZE = 6;

const PaginationControls = ({
  totalItems,
  page,
  onPageChange,
}: {
  totalItems: number;
  page: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / ADMIN_PAGE_SIZE);
  if (totalPages <= 1) return null;

  let pageNumbers: number[];
  if (totalPages <= 7) {
    pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  } else if (page <= 4) {
    pageNumbers = [1, 2, 3, 4, 5, 0, totalPages];
  } else if (page >= totalPages - 3) {
    pageNumbers = [1, 0, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pageNumbers = [1, 0, page - 1, page, page + 1, 0, totalPages];
  }

  const firstItem = (page - 1) * ADMIN_PAGE_SIZE + 1;
  const lastItem = Math.min(page * ADMIN_PAGE_SIZE, totalItems);

  return (
    <nav aria-label="Pagination" className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">Showing {firstItem}–{lastItem} of {totalItems}</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-border p-2 text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers.map((pageNumber, index) => pageNumber === 0 ? (
          <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground" aria-hidden="true">…</span>
        ) : (
          <button
            key={pageNumber}
            type="button"
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={`min-w-9 rounded-md border px-2.5 py-1.5 text-sm ${
              pageNumber === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-border p-2 text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};

type AdminProfile = {
  email?: string;
  _id?: string;
};

type Announcement = {
  _id?: string;
  title: TextValue;
  message: TextValue;
  category: TextValue;
  priority: string;
  isPublished?: boolean;
  showPopup?: boolean;
  publishedAt?: string;
};

type Timing = {
  _id?: string;
  category: "puja" | "prasad" | "mela" | "special" | "darshan" | "opening" | "closing";
  title: TextValue;
  timeText: TextValue;
  detail: TextValue;
  dayType: string;
  days?: TextValue;
  isActive?: boolean;
};

type TempleMember = {
  _id?: string;
  name: TextValue;
  type: "committee" | "purohit";
  templeRole: TextValue;
  professionDesignation: TextValue;
  phone: string;
  displayOrder: number;
  isActive: boolean;
};

type Booking = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  purohit?: { name: TextValue; phone: string } | null;
  requestedDate?: string;
  notes?: string;
  status: string;
};

type ContactRequest = {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
};

type DonationConfig = {
  _id?: string;
  title: TextValue;
  description: TextValue;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  qrCodeUrl: string;
  isPublished?: boolean;
};

type GalleryImage = {
  _id?: string;
  title: TextValue;
  description: TextValue;
  imageUrl: string;
};

type ManagedVideo = {
  _id?: string;
  title: TextValue;
  description: TextValue;
  link: string;
};

type TempleEvent = {
  _id?: string;
  title: TextValue;
  date: TextValue;
  venue: TextValue;
};

type PressItem = {
  _id?: string;
  imageUrl: string;
};

type AdminTab = "overview" | "events" | "gallery" | "members" | "videos" | "press" | "temple" | "donation";

const storageKey = "kiriteswari-admin-token";

const makeAuthHeaders = (token: string | null) => ({
  Authorization: token ? `Bearer ${token}` : "",
});

const AdminPage = () => {
  const { language } = useLanguage();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(storageKey));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timings, setTimings] = useState<Timing[]>([]);
  const [members, setMembers] = useState<TempleMember[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [listPages, setListPages] = useState<Record<string, number>>({});
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<ManagedVideo[]>([]);
  const [events, setEvents] = useState<TempleEvent[]>([]);
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [galleryForm, setGalleryForm] = useState<GalleryImage>({ title: "", description: "", imageUrl: "" });
  const [videoForm, setVideoForm] = useState<ManagedVideo>({ title: "", description: "", link: "" });
  const [eventForm, setEventForm] = useState<TempleEvent>({ title: "", date: "", venue: "" });
  const [pressImageUrl, setPressImageUrl] = useState("");
  const [donation, setDonation] = useState<DonationConfig>({
    title: "Kiriteswari Temple Charitable Trust",
    description: "Support daily puja, maintenance, and festival initiatives.",
    bankName: "Punjab National Bank",
    branchName: "Azimganj",
    accountNumber: "0930010389143",
    ifscCode: "PUNB0093020",
    upiId: "kiriteswari@upi",
    qrCodeUrl: "",
  });;
  const [announcementForm, setAnnouncementForm] = useState<Announcement>({
    title: "",
    message: "",
    category: "general",
    priority: "normal",
    isPublished: true,
  });
  const [timingForm, setTimingForm] = useState<Timing>({
    category: "darshan",
    title: "",
    timeText: "",
    detail: "",
    dayType: "daily",
    days: "প্রতিদিন",
    isActive: true,
  });
  const [memberForm, setMemberForm] = useState<TempleMember>({
    name: "",
    type: "committee",
    templeRole: "",
    professionDesignation: "",
    phone: "",
    displayOrder: 0,
    isActive: true,
  });

  const authHeaders = useMemo(() => makeAuthHeaders(token), [token]);
  const currentListPage = (list: string, totalItems: number) =>
    Math.min(listPages[list] ?? 1, Math.max(1, Math.ceil(totalItems / ADMIN_PAGE_SIZE)));
  const pageItems = <T,>(items: T[], list: string) => {
    const page = currentListPage(list, items.length);
    return items.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE);
  };
  const setListPage = (list: string, page: number) =>
    setListPages((current) => ({ ...current, [list]: page }));

  const adminTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "Camp Management", icon: CalendarDays },
    { id: "gallery", label: "Gallery Management", icon: Images },
    { id: "members", label: "Member Management", icon: Users },
    { id: "videos", label: "Video Management", icon: Video },
    { id: "press", label: "Press Management", icon: Newspaper },
    { id: "temple", label: "Temple Content", icon: Megaphone },
    { id: "donation", label: "Donations & Requests", icon: HandCoins },
  ] as const;

  const loadProfile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await apiRequest<{ data?: AdminProfile }>("/admin/profile", {
        headers: authHeaders,
      });

      setProfile(response?.data || null);
      setIsAuthenticated(true);
    } catch {
      setToken(null);
      localStorage.removeItem(storageKey);
      setIsAuthenticated(false);
    }
  }, [authHeaders, token]);

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      const [annResponse, timeResponse, memberResponse, bookingResponse, enquiryResponse, donationResponse, galleryResponse, videoResponse, eventResponse, pressResponse] = await Promise.all([
        apiRequest<{ data?: Announcement[] }>("/announcements/admin", { headers: authHeaders }),
        apiRequest<{ data?: Timing[] }>("/timings/admin", { headers: authHeaders }),
        apiRequest<{ data?: TempleMember[] }>("/members/admin", { headers: authHeaders }),
        apiRequest<{ data?: Booking[] }>("/bookings", { headers: authHeaders }),
        apiRequest<{ data?: ContactRequest[] }>("/contact", { headers: authHeaders }),
        apiRequest<{ data?: DonationConfig | DonationConfig[] }>("/donation"),
        apiRequest<{ data?: GalleryImage[] }>("/gallery/admin", { headers: authHeaders }),
        apiRequest<{ data?: ManagedVideo[] }>("/videos/admin", { headers: authHeaders }),
        apiRequest<TempleEvent[]>("/events"),
        apiRequest<PressItem[]>("/press/admin", { headers: authHeaders }),
      ]);

      setAnnouncements(Array.isArray(annResponse?.data) ? annResponse.data : []);
      setTimings(Array.isArray(timeResponse?.data) ? timeResponse.data : []);
      setMembers(Array.isArray(memberResponse?.data) ? memberResponse.data : []);
      setBookings(Array.isArray(bookingResponse?.data) ? bookingResponse.data : []);
      setContactRequests(Array.isArray(enquiryResponse?.data) ? enquiryResponse.data : []);
      setGalleryImages(Array.isArray(galleryResponse?.data) ? galleryResponse.data : []);
      setVideos(Array.isArray(videoResponse?.data) ? videoResponse.data : []);
      setEvents(Array.isArray(eventResponse) ? eventResponse : []);
      setPressItems(Array.isArray(pressResponse) ? pressResponse : []);

      const donationValue = Array.isArray(donationResponse?.data)
        ? donationResponse.data[0] || null
        : donationResponse?.data || null;

      if (donationValue) {
        setDonation({
          title: donationValue.title || "",
          description: donationValue.description || "",
          bankName: donationValue.bankName || "",
          branchName: donationValue.branchName || "",
          accountNumber: donationValue.accountNumber || "",
          ifscCode: donationValue.ifscCode || "",
          upiId: donationValue.upiId || "",
          qrCodeUrl: donationValue.qrCodeUrl || "",
          isPublished: donationValue.isPublished ?? true,
          _id: donationValue._id,
        });
      }
    } catch (error) {
      console.error("Dashboard data load failed", error);
    }
  }, [authHeaders, token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, isAuthenticated]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiRequest<{ token?: string; data?: { email?: string } }>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const nextToken = response?.token || null;
      if (!nextToken) {
        throw new Error("No token returned");
      }

      localStorage.setItem(storageKey, nextToken);
      setToken(nextToken);
      setIsAuthenticated(true);
      setProfile(response.data || null);
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(storageKey);
    setToken(null);
    setIsAuthenticated(false);
    setProfile(null);
  };

  const saveAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const payload = {
        ...announcementForm,
        isPublished: announcementForm.isPublished ?? true,
        showPopup: announcementForm.showPopup ?? true,
      };

      if (announcementForm._id) {
        await apiRequest(`/announcements/${announcementForm._id}`, {
          method: "PUT",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/announcements", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setAnnouncementForm({ title: "", message: "", category: "general", priority: "normal", isPublished: true });
      fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save announcement.");
    }
  };

  const saveTiming = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const payload = {
        ...timingForm,
        dayType: timingForm.dayType || "daily",
        isActive: timingForm.isActive ?? true,
      };
      if (timingForm._id) {
        await apiRequest(`/timings/${timingForm._id}`, {
          method: "PUT",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/timings", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setTimingForm({ category: "darshan", title: "", timeText: "", detail: "", dayType: "প্রতিদিন", days: "প্রতিদিন", isActive: true });
      fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save timing.");
    }
  };

  const saveMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const payload = { ...memberForm, displayOrder: Number(memberForm.displayOrder) || 0 };
      await apiRequest(memberForm._id ? `/members/${memberForm._id}` : "/members", {
        method: memberForm._id ? "PUT" : "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMemberForm({
        name: "",
        type: "committee",
        templeRole: "",
        professionDesignation: "",
        phone: "",
        displayOrder: 0,
        isActive: true,
      });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save member.");
    }
  };

  const deleteMember = async (member: TempleMember) => {
    if (!token || !member._id || !window.confirm(`Delete ${getLocalizedText(member.name, language)} from the list?`)) return;
    try {
      await apiRequest(`/members/${member._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete member.");
    }
  };

  const deleteTiming = async (timing: Timing) => {
    if (!token || !timing._id || !window.confirm(`Delete "${getLocalizedText(timing.title, language)}"?`)) return;
    try {
      await apiRequest(`/timings/${timing._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete timing.");
    }
  };

  const deleteAnnouncement = async (announcement: Announcement) => {
    if (!token || !announcement._id || !window.confirm(`Delete "${getLocalizedText(announcement.title, language)}"?`)) return;
    try {
      await apiRequest(`/announcements/${announcement._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete announcement.");
    }
  };

  const deleteBooking = async (booking: Booking) => {
    if (!token || !booking._id || !window.confirm(`Delete the booking request from ${booking.name}?`)) return;
    try {
      await apiRequest(`/bookings/${booking._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete booking request.");
    }
  };

  const deleteEnquiry = async (enquiry: ContactRequest) => {
    if (!token || !enquiry._id || !window.confirm(`Delete the enquiry from ${enquiry.name}?`)) return;
    try {
      await apiRequest(`/contact/${enquiry._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete enquiry.");
    }
  };

  const saveDonation = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const payload = { ...donation, isPublished: true };
      if (donation._id) {
        await apiRequest(`/donation/${donation._id}`, {
          method: "PUT",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/donation", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save donation details.");
    }
  };

  const uploadImage = async (file: File, folder: string) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please choose an image file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await apiRequest<{ url?: string }>(`/upload?${new URLSearchParams({ folder })}`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });

    if (!response.url) {
      throw new Error("The image upload did not return a Cloudinary URL.");
    }
    return response.url;
  };

  const handleQrUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const qrCodeUrl = await uploadImage(file, "kiriteswari/donations");
      setDonation((current) => ({ ...current, qrCodeUrl }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload QR image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, "kiriteswari/gallery");
      setGalleryForm((current) => ({ ...current, imageUrl }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload gallery image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handlePressUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setPressImageUrl(await uploadImage(file, "kiriteswari/press"));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload press image.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const saveGalleryImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiRequest(galleryForm._id ? `/gallery/${galleryForm._id}` : "/gallery", {
        method: galleryForm._id ? "PUT" : "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(galleryForm),
      });
      setGalleryForm({ title: "", description: "", imageUrl: "" });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save gallery image.");
    }
  };

  const deleteGalleryImage = async (image: GalleryImage) => {
    if (!token || !image._id || !window.confirm(`Delete "${getLocalizedText(image.title, language)}" from the gallery?`)) return;
    try {
      await apiRequest(`/gallery/${image._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete gallery image.");
    }
  };

  const saveVideo = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiRequest(videoForm._id ? `/videos/${videoForm._id}` : "/videos", {
        method: videoForm._id ? "PUT" : "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(videoForm),
      });
      setVideoForm({ title: "", description: "", link: "" });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save video.");
    }
  };

  const deleteVideo = async (video: ManagedVideo) => {
    if (!token || !video._id || !window.confirm(`Delete "${getLocalizedText(video.title, language)}"?`)) return;
    try {
      await apiRequest(`/videos/${video._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete video.");
    }
  };

  const saveEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiRequest(eventForm._id ? `/events/${eventForm._id}` : "/events", {
        method: eventForm._id ? "PUT" : "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });
      setEventForm({ title: "", date: "", venue: "" });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save event.");
    }
  };

  const deleteEvent = async (event: TempleEvent) => {
    if (!token || !event._id || !window.confirm(`Delete "${getLocalizedText(event.title, language)}"?`)) return;
    try {
      await apiRequest(`/events/${event._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete event.");
    }
  };

  const savePressImage = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await apiRequest("/press", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: pressImageUrl }),
      });
      setPressImageUrl("");
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save press image.");
    }
  };

  const deletePressImage = async (item: PressItem) => {
    if (!token || !item._id || !window.confirm("Delete this press image?")) return;
    try {
      await apiRequest(`/press/${item._id}`, { method: "DELETE", headers: authHeaders });
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete press image.");
    }
  };

  const updateStatus = async (url: string, status: string) => {
    if (!token) return;

    try {
      await apiRequest(url, {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status.");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-28">
          <div className="container-temple mx-auto px-4 py-16">
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-primary">Admin access</p>
                  <h1 className="font-display text-3xl font-bold text-foreground">Temple CMS</h1>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block font-body text-sm font-medium text-foreground">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="admin@temple.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-body text-sm font-medium text-foreground">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-saffron px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-saffron transition-transform hover:scale-[1.02] disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Login to dashboard"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-28">
        <div className="container-temple mx-auto px-4 py-10">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Dashboard</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Temple Management</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {profile?.email || "Admin"}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          <nav aria-label="Admin sections" className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 py-3 text-center text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-green-200 bg-card text-foreground hover:bg-green-50"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {activeTab === "overview" && <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Announcements</span>
                <BellRing size={18} className="text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">{announcements.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Timings</span>
                <CalendarClock size={18} className="text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">{timings.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bookings</span>
                <HeartHandshake size={18} className="text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">{bookings.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Enquiries</span>
                <Inbox size={18} className="text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">{contactRequests.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gallery images</span>
                <Images size={18} className="text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">{galleryImages.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Videos</span>
                <Video size={18} className="text-primary" />
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">{videos.length}</p>
            </div>
          </div>}

          {activeTab === "temple" && <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={saveAnnouncement} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 font-display text-2xl font-bold text-foreground">Announcements</h2>

              <div className="space-y-4">
                <LocalizedTextField label="Announcement title" value={announcementForm.title} onChange={(title) => setAnnouncementForm({ ...announcementForm, title })} />
                <LocalizedTextField label="Announcement message" value={announcementForm.message} onChange={(message) => setAnnouncementForm({ ...announcementForm, message })} multiline />
                <div className="grid gap-4 md:grid-cols-2">
                  <LocalizedTextField label="Category" value={announcementForm.category} onChange={(category) => setAnnouncementForm({ ...announcementForm, category })} />
                  <select
                    value={announcementForm.priority}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={announcementForm.isPublished ?? true}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, isPublished: e.target.checked })}
                  />
                  Publish now
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={announcementForm.showPopup ?? true}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, showPopup: e.target.checked })}
                  />
                  Show as homepage popup (high priority only)
                </label>
                <button type="submit" className="w-full rounded-lg bg-gradient-saffron px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-saffron">
                  Save announcement
                </button>
              </div>
            </form>

            <form onSubmit={saveTiming} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 font-display text-2xl font-bold text-foreground">Timings</h2>

              <div className="space-y-4">
                <select
                  value={timingForm.category}
                  onChange={(e) => setTimingForm({ ...timingForm, category: e.target.value as Timing["category"] })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="opening">মন্দির খোলার সময়</option>
                  <option value="closing">মন্দির বন্ধের সময়</option>
                  <option value="puja">পূজা</option>
                  <option value="darshan">দর্শন</option>
                  <option value="prasad">প্রসাদ</option>
                  <option value="mela">মেলা</option>
                  <option value="special">বিশেষ সময়সূচি</option>
                </select>
                <LocalizedTextField label="শিরোনাম / কার্যক্রম" value={timingForm.title} onChange={(title) => setTimingForm({ ...timingForm, title })} />
                <LocalizedTextField label="সময়" value={timingForm.timeText} onChange={(timeText) => setTimingForm({ ...timingForm, timeText })} />
                <LocalizedTextField label="কোন দিন" value={timingForm.days} onChange={(days) => setTimingForm({ ...timingForm, days })} />
                <LocalizedTextField label="অতিরিক্ত তথ্য" value={timingForm.detail} onChange={(detail) => setTimingForm({ ...timingForm, detail })} multiline />
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={timingForm.isActive ?? true}
                      onChange={(e) => setTimingForm({ ...timingForm, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
                <button type="submit" className="w-full rounded-lg bg-gradient-saffron px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-saffron">
                {timingForm._id ? "সময়সূচি আপডেট করুন" : "সময়সূচি যোগ করুন"}
                </button>
              </div>
            </form>
          </div>}

          {(activeTab === "temple" || activeTab === "members") && <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {activeTab === "temple" && <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-2 font-display text-2xl font-bold text-foreground">সময়সূচি পরিচালনা</h2>
              <p className="mb-5 text-sm text-muted-foreground">প্রকাশিত (Active) সময়সূচিই ওয়েবসাইটে দেখা যাবে।</p>
              <div className="space-y-3">
                {timings.length === 0 ? (
                <p className="text-sm text-muted-foreground">এখনো কোনো সময়সূচি নেই। নমুনা যোগ করতে `npm run seed:temple-samples` চালান।</p>
                ) : pageItems(timings, "timings").map((timing) => (
                <div key={timing._id || `${timing.category}-${timing.title}`} className="rounded-lg border border-border bg-background p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{getLocalizedText(timing.title, language)}</p>
                      <p className="text-sm text-primary">{getLocalizedText(timing.timeText, language)} · {getLocalizedText(timing.days || timing.dayType, language)}</p>
                      {timing.detail && <p className="text-sm text-muted-foreground">{getLocalizedText(timing.detail, language)}</p>}
                      <p className="text-xs text-muted-foreground">{timing.category} · {timing.isActive ? "প্রকাশিত" : "খসড়া"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTimingForm({ ...timing, days: timing.days || timing.dayType })}
                        className="rounded-md border border-border px-3 py-1 text-xs hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteTiming(timing)} className="rounded-md border border-destructive/30 px-3 py-1 text-xs text-destructive hover:bg-destructive/10">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
              <PaginationControls
                totalItems={timings.length}
                page={currentListPage("timings", timings.length)}
                onPageChange={(page) => setListPage("timings", page)}
              />
            </section>}

            {activeTab === "members" && <form onSubmit={saveMember} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-bold text-foreground">
                <Users size={22} className="text-primary" /> কমিটি / পুরোহিত তালিকা
              </h2>
              <div className="space-y-4">
                <select
                value={memberForm.type}
                onChange={(e) => setMemberForm({ ...memberForm, type: e.target.value as TempleMember["type"] })}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                <option value="committee">কমিটি</option>
                <option value="purohit">পুরোহিত</option>
                </select>
                <LocalizedTextField label="নাম" value={memberForm.name} onChange={(name) => setMemberForm({ ...memberForm, name })} />
                <LocalizedTextField label="পদ / দায়িত্ব" value={memberForm.templeRole} onChange={(templeRole) => setMemberForm({ ...memberForm, templeRole })} />
                <div className="grid gap-4 sm:grid-cols-2">
                <LocalizedTextField label="অতিরিক্ত পরিচিতি (ঐচ্ছিক)" value={memberForm.professionDesignation} onChange={(professionDesignation) => setMemberForm({ ...memberForm, professionDesignation })} />
                <input
                  type="tel"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="ফোন (ঐচ্ছিক, যেমন +91 98765 43210)"
                />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={memberForm.isActive} onChange={(e) => setMemberForm({ ...memberForm, isActive: e.target.checked })} />
                  ওয়েবসাইটে প্রকাশ করুন
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  ক্রম
                  <input type="number" min="0" value={memberForm.displayOrder} onChange={(e) => setMemberForm({ ...memberForm, displayOrder: Number(e.target.value) })} className="w-20 rounded-md border border-input bg-background px-2 py-1" />
                </label>
                </div>
                <div className="flex gap-3">
                <button type="submit" className="flex-1 rounded-lg bg-gradient-saffron px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-saffron">
                  {memberForm._id ? "তথ্য আপডেট করুন" : "নাম যোগ করুন"}
                </button>
                {memberForm._id && (
                  <button type="button" onClick={() => setMemberForm({ name: "", type: "committee", templeRole: "", professionDesignation: "", phone: "", displayOrder: 0, isActive: true })} className="rounded-lg border border-border px-4 py-3 text-sm">
                    বাতিল
                  </button>
                )}
                </div>
              </div>
            </form>}
          </div>}

          {activeTab === "temple" && <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 font-display text-xl font-bold text-foreground">Announcements ({announcements.length})</h2>
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements added yet.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pageItems(announcements, "announcements").map((announcement) => (
                  <article key={announcement._id || getLocalizedText(announcement.title, language)} className="rounded-lg border border-border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{getLocalizedText(announcement.title, language)}</h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{getLocalizedText(announcement.message, language)}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {getLocalizedText(announcement.category, language)} · {announcement.isPublished ? "Published" : "Draft"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button type="button" onClick={() => setAnnouncementForm(announcement)} className="rounded-md border border-border px-2.5 py-1.5 text-xs">Edit</button>
                        <button type="button" onClick={() => deleteAnnouncement(announcement)} className="rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs text-destructive">Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <PaginationControls
              totalItems={announcements.length}
              page={currentListPage("announcements", announcements.length)}
              onPageChange={(page) => setListPage("announcements", page)}
            />
          </section>}

          {activeTab === "members" && <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-5 font-display text-2xl font-bold text-foreground">বর্তমান সদস্য তালিকা ({members.length})</h2>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">এখনো কোনো কমিটি সদস্য বা পুরোহিত যোগ করা হয়নি।</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pageItems(members, "members").map((member) => (
                <div key={member._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-2.5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{getLocalizedText(member.name, language)}</p>
                    <p className="text-xs text-muted-foreground">{member.type === "committee" ? "কমিটি" : "পুরোহিত"} · {getLocalizedText(member.templeRole, language)}</p>
                    {member.professionDesignation && <p className="text-xs text-muted-foreground">{getLocalizedText(member.professionDesignation, language)}</p>}
                    <p className="text-[11px] text-muted-foreground">{member.isActive ? "ওয়েবসাইটে প্রকাশিত" : "খসড়া"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setMemberForm(member)} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-muted">Edit</button>
                    <button type="button" onClick={() => deleteMember(member)} className="rounded-md border border-destructive/30 px-3 py-1 text-xs text-destructive hover:bg-destructive/10">Delete</button>
                  </div>
                </div>
                ))}
              </div>
            )}
            <PaginationControls
              totalItems={members.length}
              page={currentListPage("members", members.length)}
              onPageChange={(page) => setListPage("members", page)}
            />
          </section>}

          {activeTab === "events" && <section className="mt-8 rounded-2xl border border-green-200 bg-card p-6 shadow-sm">
            <h2 className="mb-5 font-display text-2xl font-bold text-foreground">Camp / Event Management</h2>
            <form onSubmit={saveEvent} className="mb-8 grid gap-4 md:grid-cols-3">
              <LocalizedTextField label="Camp or event name" value={eventForm.title} onChange={(title) => setEventForm({ ...eventForm, title })} />
              <LocalizedTextField label="Date / schedule" value={eventForm.date} onChange={(date) => setEventForm({ ...eventForm, date })} />
              <LocalizedTextField label="Venue / details" value={eventForm.venue} onChange={(venue) => setEventForm({ ...eventForm, venue })} />
              <button type="submit" className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white md:col-span-3">
                {eventForm._id ? "Update event" : "Add event"}
              </button>
            </form>
            <div className="space-y-3">
              {events.length === 0 ? <p className="text-sm text-muted-foreground">No camps or events added yet.</p> : pageItems(events, "events").map((event) => (
                <div key={event._id || getLocalizedText(event.title, language)} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div><p className="font-semibold">{getLocalizedText(event.title, language)}</p><p className="text-sm text-muted-foreground">{getLocalizedText(event.date, language)} · {getLocalizedText(event.venue, language)}</p></div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEventForm(event)} className="rounded-md border border-border px-3 py-2 text-sm">Edit</button>
                    <button type="button" onClick={() => deleteEvent(event)} className="rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <PaginationControls
              totalItems={events.length}
              page={currentListPage("events", events.length)}
              onPageChange={(page) => setListPage("events", page)}
            />
          </section>}

          {activeTab === "gallery" && <section className="mt-8 rounded-2xl border border-green-200 bg-card p-6 shadow-sm">
            <form onSubmit={saveGalleryImage} className="mb-8 rounded-xl border border-border p-5">
              <h2 className="mb-5 font-display text-2xl font-bold text-foreground">{galleryForm._id ? "Edit Gallery Image" : "Add New Image"}</h2>
              <div className="space-y-4">
                <LocalizedTextField label="Title" value={galleryForm.title} onChange={(title) => setGalleryForm({ ...galleryForm, title })} />
                <LocalizedTextField label="Description" value={galleryForm.description} onChange={(description) => setGalleryForm({ ...galleryForm, description })} multiline />
                <label className="block text-sm font-medium">
                  Image file — uploads to Cloudinary
                  <input type="file" accept="image/*" disabled={uploading} onChange={handleGalleryUpload} className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                </label>
                {uploading && <p className="text-sm text-muted-foreground">Uploading image…</p>}
                {galleryForm.imageUrl && <img src={galleryForm.imageUrl} alt="Selected gallery upload preview" className="h-40 w-full rounded-lg object-cover sm:w-64" />}
                <div className="flex gap-3">
                  <button type="submit" disabled={uploading} className="flex-1 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
                    {galleryForm._id ? "Update Image" : "Add Image"}
                  </button>
                  {galleryForm._id && <button type="button" onClick={() => setGalleryForm({ title: "", description: "", imageUrl: "" })} className="rounded-lg border border-border px-4 py-3 text-sm">Cancel</button>}
                </div>
              </div>
            </form>
            <h3 className="mb-4 text-xl font-bold">All Images ({galleryImages.length})</h3>
            {galleryImages.length === 0 ? <p className="text-sm text-muted-foreground">No gallery images yet.</p> : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pageItems(galleryImages, "gallery").map((image) => (
                  <article key={image._id || image.imageUrl} className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                    {image.imageUrl ? (
                      <img src={image.imageUrl} alt={getLocalizedText(image.title, language)} className="h-32 w-full object-cover" />
                    ) : (
                      <div className="flex h-32 items-center justify-center bg-muted text-xs text-muted-foreground">No image uploaded</div>
                    )}
                    <div className="p-3">
                      <h4 className="text-sm font-semibold">{getLocalizedText(image.title, language) || "Untitled image"}</h4>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{getLocalizedText(image.description, language)}</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={() => setGalleryForm(image)} className="rounded-md border border-border px-2.5 py-1.5 text-xs">Edit</button>
                        <button type="button" onClick={() => deleteGalleryImage(image)} className="rounded-md bg-destructive px-2.5 py-1.5 text-xs text-destructive-foreground">Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <PaginationControls
              totalItems={galleryImages.length}
              page={currentListPage("gallery", galleryImages.length)}
              onPageChange={(page) => setListPage("gallery", page)}
            />
          </section>}

          {activeTab === "videos" && <section className="mt-8 rounded-2xl border border-green-200 bg-card p-6 shadow-sm">
            <form onSubmit={saveVideo} className="mb-8 rounded-xl border border-border p-5">
              <h2 className="mb-5 font-display text-2xl font-bold text-foreground">{videoForm._id ? "Edit Video" : "Add New Video"}</h2>
              <div className="space-y-4">
                <LocalizedTextField label="Title" value={videoForm.title} onChange={(title) => setVideoForm({ ...videoForm, title })} />
                <LocalizedTextField label="Description" value={videoForm.description} onChange={(description) => setVideoForm({ ...videoForm, description })} multiline />
                <input type="url" value={videoForm.link} onChange={(e) => setVideoForm({ ...videoForm, link: e.target.value })} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" placeholder="YouTube video URL (optional)" />
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white">{videoForm._id ? "Update Video" : "Add Video"}</button>
                  {videoForm._id && <button type="button" onClick={() => setVideoForm({ title: "", description: "", link: "" })} className="rounded-lg border border-border px-4 py-3 text-sm">Cancel</button>}
                </div>
              </div>
            </form>
            <h3 className="mb-4 text-xl font-bold">All Videos ({videos.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead><tr className="border-b border-border"><th className="p-3">Title</th><th className="p-3">Description</th><th className="p-3">URL</th><th className="p-3">Actions</th></tr></thead>
                <tbody>{pageItems(videos, "videos").map((video) => (
                  <tr key={video._id || video.link} className="border-b border-border">
                    <td className="p-3 font-medium">{getLocalizedText(video.title, language) || "Untitled video"}</td><td className="p-3">{getLocalizedText(video.description, language)}</td>
                    <td className="p-3">{video.link ? <a href={video.link} target="_blank" rel="noreferrer" className="text-primary underline">Watch</a> : <span className="text-muted-foreground">No URL</span>}</td>
                    <td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => setVideoForm(video)} className="rounded-md border border-border px-3 py-2">Edit</button><button type="button" onClick={() => deleteVideo(video)} className="rounded-md bg-destructive px-3 py-2 text-destructive-foreground">Delete</button></div></td>
                  </tr>
                ))}</tbody>
              </table>
              {videos.length === 0 && <p className="py-4 text-sm text-muted-foreground">No videos added yet.</p>}
            </div>
            <PaginationControls
              totalItems={videos.length}
              page={currentListPage("videos", videos.length)}
              onPageChange={(page) => setListPage("videos", page)}
            />
          </section>}

          {activeTab === "press" && <section className="mt-8 rounded-2xl border border-green-200 bg-card p-6 shadow-sm">
            <form onSubmit={savePressImage} className="mb-8 rounded-xl border border-border p-5">
              <h2 className="mb-5 font-display text-2xl font-bold text-foreground">Add Press Image</h2>
              <label className="block text-sm font-medium">
                Image file — uploads to Cloudinary
                <input type="file" accept="image/*" disabled={uploading} onChange={handlePressUpload} className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
              </label>
              {uploading && <p className="mt-2 text-sm text-muted-foreground">Uploading image…</p>}
              {pressImageUrl && <img src={pressImageUrl} alt="Selected press upload preview" className="mt-4 h-40 rounded-lg object-cover" />}
              <button type="submit" disabled={uploading} className="mt-4 w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Add Press Image</button>
            </form>
            <h3 className="mb-4 text-xl font-bold">Press Images ({pressItems.length})</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems(pressItems, "press").map((item) => (
                <article key={item._id || item.imageUrl} className="overflow-hidden rounded-xl border border-border">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="Press clipping" className="h-32 w-full object-contain" />
                  ) : (
                    <div className="flex h-32 items-center justify-center bg-muted text-xs text-muted-foreground">No image uploaded</div>
                  )}
                  <button type="button" onClick={() => deletePressImage(item)} className="m-2 rounded-md bg-destructive px-2.5 py-1.5 text-xs text-destructive-foreground">Delete</button>
                </article>
              ))}
            </div>
            {pressItems.length === 0 && <p className="text-sm text-muted-foreground">No press images yet.</p>}
            <PaginationControls
              totalItems={pressItems.length}
              page={currentListPage("press", pressItems.length)}
              onPageChange={(page) => setListPage("press", page)}
            />
          </section>}

          {activeTab === "donation" && <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <form onSubmit={saveDonation} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-5 font-display text-2xl font-bold text-foreground">Donation settings</h2>
              <div className="space-y-4">
                <LocalizedTextField label="Donation title" value={donation.title} onChange={(title) => setDonation({ ...donation, title })} />
                <LocalizedTextField label="Thank-you message" value={donation.description} onChange={(description) => setDonation({ ...donation, description })} multiline />
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={donation.bankName} onChange={(e) => setDonation({ ...donation, bankName: e.target.value })} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Bank name" />
                  <input value={donation.branchName} onChange={(e) => setDonation({ ...donation, branchName: e.target.value })} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Branch name" />
                  <input value={donation.accountNumber} onChange={(e) => setDonation({ ...donation, accountNumber: e.target.value })} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Account number" />
                  <input value={donation.ifscCode} onChange={(e) => setDonation({ ...donation, ifscCode: e.target.value })} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="IFSC" />
                </div>
                <input value={donation.upiId} onChange={(e) => setDonation({ ...donation, upiId: e.target.value })} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="UPI ID" />
                <label className="block text-sm font-medium text-foreground">
                  QR code image — uploads directly to Cloudinary
                  <input type="file" accept="image/*" disabled={uploading} onChange={handleQrUpload} className="mt-2 block w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                </label>
                {uploading && <p className="text-sm text-muted-foreground">Uploading QR image…</p>}
                {donation.qrCodeUrl && <img src={donation.qrCodeUrl} alt="Donation QR preview" className="h-48 w-48 rounded-lg border border-border object-contain" />}
                <button type="submit" disabled={uploading} className="w-full rounded-lg bg-gradient-saffron px-5 py-3 font-body text-sm font-semibold text-primary-foreground shadow-saffron disabled:opacity-50">
                  Save donation details
                </button>
              </div>
            </form>

            <div className="space-y-8">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h2 className="mb-3 font-display text-xl font-bold text-foreground">Bookings</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {bookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No booking requests yet.</p>
                  ) : (
                    pageItems(bookings, "bookings").map((booking) => (
                      <div key={booking._id || booking.email} className="rounded-lg border border-border bg-background p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{booking.name || "Unnamed visitor"}</p>
                            <p className="text-[11px] text-muted-foreground">{booking.serviceType}</p>
                            {booking.purohit && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Purohit: {getLocalizedText(booking.purohit.name, language)}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <select
                              value={booking.status || "new"}
                              onChange={(e) => updateStatus(`/bookings/${booking._id}/status`, e.target.value)}
                              aria-label={`Booking status for ${booking.name || "visitor"}`}
                              className="max-w-28 rounded-md border border-input bg-background px-1.5 py-1 text-[11px] outline-none focus:border-primary"
                            >
                              <option value="new">New</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              type="button"
                              aria-label={`Delete booking from ${booking.name || "visitor"}`}
                              onClick={() => deleteBooking(booking)}
                              className="rounded-md border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {booking.requestedDate && (
                          <p className="mt-1.5 text-[11px] text-muted-foreground">Preferred date: {booking.requestedDate}</p>
                        )}
                        {booking.notes && <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-[11px] text-muted-foreground">{booking.notes}</p>}
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                          <a href={`mailto:${booking.email}`} className="underline underline-offset-2">{booking.email}</a>
                          <a href={`tel:${booking.phone}`} className="inline-flex items-center gap-1 underline underline-offset-2">
                            <Phone size={13} /> {booking.phone}
                          </a>
                          <a
                            href={`https://wa.me/${toWhatsAppNumber(booking.phone)}?text=${encodeURIComponent(`Hello ${booking.name}, regarding your ${booking.serviceType} booking request${booking.requestedDate ? ` for ${booking.requestedDate}` : ""}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-emerald-700"
                          >
                            <MessageCircle size={13} /> WhatsApp visitor
                          </a>
                          {booking.purohit?.phone && (
                            <>
                              <a href={`tel:${booking.purohit.phone}`} className="inline-flex items-center gap-1 underline underline-offset-2">
                                <Phone size={13} /> Call purohit
                              </a>
                              <a
                                href={`https://wa.me/${toWhatsAppNumber(booking.purohit.phone)}?text=${encodeURIComponent(`Hello, new ${booking.serviceType} booking request from ${booking.name}${booking.requestedDate ? ` for ${booking.requestedDate}` : ""}. Visitor phone: ${booking.phone}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-emerald-700"
                              >
                                <MessageCircle size={13} /> WhatsApp purohit
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <PaginationControls
                  totalItems={bookings.length}
                  page={currentListPage("bookings", bookings.length)}
                  onPageChange={(page) => setListPage("bookings", page)}
                />
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h2 className="mb-3 font-display text-xl font-bold text-foreground">Visitor enquiries</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {contactRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No enquiries received yet.</p>
                  ) : (
                    pageItems(contactRequests, "enquiries").map((enquiry) => (
                      <div key={enquiry._id || enquiry.email} className="rounded-lg border border-border bg-background p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{enquiry.name || "Unnamed visitor"}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{enquiry.subject || "No subject"}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <select
                              value={enquiry.status || "new"}
                              onChange={(e) => updateStatus(`/contact/${enquiry._id}/status`, e.target.value)}
                              aria-label={`Enquiry status for ${enquiry.name || "visitor"}`}
                              className="max-w-28 rounded-md border border-input bg-background px-1.5 py-1 text-[11px] outline-none focus:border-primary"
                            >
                              <option value="new">New</option>
                              <option value="in-progress">In progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <button
                              type="button"
                              aria-label={`Delete enquiry from ${enquiry.name || "visitor"}`}
                              onClick={() => deleteEnquiry(enquiry)}
                              className="rounded-md border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-[11px] text-muted-foreground">{enquiry.message}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                          <a href={`mailto:${enquiry.email}`} className="underline underline-offset-2">{enquiry.email}</a>
                          {enquiry.phone && (
                            <>
                              <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-1 underline underline-offset-2">
                                <Phone size={13} /> {enquiry.phone}
                              </a>
                              <a
                                href={`https://wa.me/${toWhatsAppNumber(enquiry.phone)}?text=${encodeURIComponent(`Hello ${enquiry.name}, regarding your enquiry: ${enquiry.subject}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-emerald-700"
                              >
                                <MessageCircle size={13} /> WhatsApp
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <PaginationControls
                  totalItems={contactRequests.length}
                  page={currentListPage("enquiries", contactRequests.length)}
                  onPageChange={(page) => setListPage("enquiries", page)}
                />
              </div>
            </div>
          </div>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminPage;
