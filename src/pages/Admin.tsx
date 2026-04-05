import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Users, LogOut, RefreshCcw, Save, FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { clearAuthSession, getAuthSession } from "@/lib/auth";
import {
  defaultCmsContent,
  fetchAdminCmsContent,
  updateAdminCmsContent,
  type CmsContent,
} from "@/lib/cms";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  createdAt: string;
};

type AdminTab = "users" | "content";

const Admin = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [content, setContent] = useState<CmsContent>(defaultCmsContent);
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  const [savingContent, setSavingContent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getAdminSession = () => {
    const session = getAuthSession();

    if (!session) {
      navigate("/login");
      return null;
    }

    if (session.user.role !== "admin") {
      toast({
        title: "Access denied",
        description: "Only admin users can open this panel.",
        variant: "destructive",
      });
      navigate("/");
      return null;
    }

    return session;
  };

  const loadUsers = async () => {
    setLoadingUsers(true);

    try {
      if (!getAdminSession()) {
        return;
      }

      const data = await api.get<{ users: AdminUser[] }>("/api/admin/users");
      setUsers(data.users);
    } catch (error) {
      toast({
        title: "Could not load users",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadContent = async () => {
    setLoadingContent(true);

    try {
      if (!getAdminSession()) {
        return;
      }

      const cmsContent = await fetchAdminCmsContent();
      setContent(cmsContent);
    } catch (error) {
      toast({
        title: "Could not load content",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    if (!getAdminSession()) {
      return;
    }

    void loadUsers();
    void loadContent();
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const setContentField = <K extends keyof CmsContent>(key: K, value: CmsContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
  };

  const handleSaveContent = async () => {
    setSavingContent(true);

    try {
      const response = await updateAdminCmsContent(content);
      setContent(response.content);

      toast({
        title: "CMS updated",
        description: response.message,
      });
    } catch (error) {
      toast({
        title: "Could not save content",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setSavingContent(false);
    }
  };

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                  <Shield className="h-7 w-7 text-primary" />
                  Admin CMS Panel
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage signup records and edit website content from one place.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => void loadUsers()} disabled={loadingUsers}>
                  <RefreshCcw className="h-4 w-4" />
                  Refresh Users
                </Button>
                <Button variant="outline" onClick={() => void loadContent()} disabled={loadingContent}>
                  <RefreshCcw className="h-4 w-4" />
                  Refresh CMS
                </Button>
                <Button variant="hero-outline" asChild>
                  <Link to="/events">View Events</Link>
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")}> 
                <Users className="h-4 w-4" />
                User Records
              </Button>
              <Button variant={activeTab === "content" ? "default" : "outline"} onClick={() => setActiveTab("content")}> 
                <FileText className="h-4 w-4" />
                Website Content
              </Button>
            </div>

            {activeTab === "users" && (
              <div className="glass rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Registered Users</h2>
                  <span className="text-xs text-muted-foreground">({users.length})</span>
                </div>

                {loadingUsers ? (
                  <div className="p-10 text-center text-muted-foreground">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">No users registered yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-card/60">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Name</th>
                          <th className="text-left px-4 py-3 font-medium">Email</th>
                          <th className="text-left px-4 py-3 font-medium">Role</th>
                          <th className="text-left px-4 py-3 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t border-border/70">
                            <td className="px-4 py-3">{user.name}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3 capitalize">{user.role}</td>
                            <td className="px-4 py-3">{new Date(user.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "content" && (
              <div className="glass rounded-xl border border-border p-6 space-y-8">
                {loadingContent ? (
                  <div className="text-center text-muted-foreground py-8">Loading CMS content...</div>
                ) : (
                  <>
                    <section className="space-y-4">
                      <h2 className="text-xl font-semibold">Homepage Hero</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="home_badge_text">Badge text</Label>
                          <Input
                            id="home_badge_text"
                            value={content.home_badge_text}
                            onChange={(e) => setContentField("home_badge_text", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home_title">Main title</Label>
                          <Input
                            id="home_title"
                            value={content.home_title}
                            onChange={(e) => setContentField("home_title", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="home_subtitle">Subtitle</Label>
                        <Textarea
                          id="home_subtitle"
                          rows={3}
                          value={content.home_subtitle}
                          onChange={(e) => setContentField("home_subtitle", e.target.value)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="home_primary_cta_text">Primary button text</Label>
                          <Input
                            id="home_primary_cta_text"
                            value={content.home_primary_cta_text}
                            onChange={(e) => setContentField("home_primary_cta_text", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home_primary_cta_link">Primary button link</Label>
                          <Input
                            id="home_primary_cta_link"
                            value={content.home_primary_cta_link}
                            onChange={(e) => setContentField("home_primary_cta_link", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="home_secondary_cta_text">Secondary button text</Label>
                          <Input
                            id="home_secondary_cta_text"
                            value={content.home_secondary_cta_text}
                            onChange={(e) => setContentField("home_secondary_cta_text", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home_secondary_cta_link">Secondary button link</Label>
                          <Input
                            id="home_secondary_cta_link"
                            value={content.home_secondary_cta_link}
                            onChange={(e) => setContentField("home_secondary_cta_link", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="home_stat_members">Members stat</Label>
                          <Input
                            id="home_stat_members"
                            value={content.home_stat_members}
                            onChange={(e) => setContentField("home_stat_members", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home_stat_events">Events stat</Label>
                          <Input
                            id="home_stat_events"
                            value={content.home_stat_events}
                            onChange={(e) => setContentField("home_stat_events", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home_stat_partners">Partners stat</Label>
                          <Input
                            id="home_stat_partners"
                            value={content.home_stat_partners}
                            onChange={(e) => setContentField("home_stat_partners", e.target.value)}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-semibold">Announcement Banner</h2>

                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="announcement_enabled"
                          checked={content.announcement_enabled}
                          onCheckedChange={(checked) => setContentField("announcement_enabled", checked === true)}
                        />
                        <Label htmlFor="announcement_enabled">Show announcement banner on homepage</Label>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="announcement_title">Announcement title</Label>
                          <Input
                            id="announcement_title"
                            value={content.announcement_title}
                            onChange={(e) => setContentField("announcement_title", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="announcement_speaker">Speaker</Label>
                          <Input
                            id="announcement_speaker"
                            value={content.announcement_speaker}
                            onChange={(e) => setContentField("announcement_speaker", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="announcement_body">Announcement body</Label>
                        <Textarea
                          id="announcement_body"
                          rows={3}
                          value={content.announcement_body}
                          onChange={(e) => setContentField("announcement_body", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="announcement_join_link">Join link</Label>
                        <Input
                          id="announcement_join_link"
                          value={content.announcement_join_link}
                          onChange={(e) => setContentField("announcement_join_link", e.target.value)}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="announcement_date">Date</Label>
                          <Input
                            id="announcement_date"
                            value={content.announcement_date}
                            onChange={(e) => setContentField("announcement_date", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="announcement_time">Time</Label>
                          <Input
                            id="announcement_time"
                            value={content.announcement_time}
                            onChange={(e) => setContentField("announcement_time", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="announcement_mode">Mode</Label>
                          <Input
                            id="announcement_mode"
                            value={content.announcement_mode}
                            onChange={(e) => setContentField("announcement_mode", e.target.value)}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-semibold">About Page</h2>
                      <div className="space-y-2">
                        <Label htmlFor="about_hero_title">About hero title</Label>
                        <Input
                          id="about_hero_title"
                          value={content.about_hero_title}
                          onChange={(e) => setContentField("about_hero_title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about_hero_description">About hero description</Label>
                        <Textarea
                          id="about_hero_description"
                          rows={3}
                          value={content.about_hero_description}
                          onChange={(e) => setContentField("about_hero_description", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about_mission_heading">Mission heading</Label>
                        <Input
                          id="about_mission_heading"
                          value={content.about_mission_heading}
                          onChange={(e) => setContentField("about_mission_heading", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about_mission_body">Mission body</Label>
                        <Textarea
                          id="about_mission_body"
                          rows={4}
                          value={content.about_mission_body}
                          onChange={(e) => setContentField("about_mission_body", e.target.value)}
                        />
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-semibold">Links (JSON)</h2>
                      <p className="text-sm text-muted-foreground">
                        Use JSON arrays. Example: {`[{"name":"Home","path":"/"}]`}
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="navbar_links_json">Navbar links JSON</Label>
                        <Textarea
                          id="navbar_links_json"
                          rows={4}
                          value={content.navbar_links_json}
                          onChange={(e) => setContentField("navbar_links_json", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="footer_quick_links_json">Footer quick links JSON</Label>
                        <Textarea
                          id="footer_quick_links_json"
                          rows={4}
                          value={content.footer_quick_links_json}
                          onChange={(e) => setContentField("footer_quick_links_json", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="footer_involved_links_json">Footer get-involved links JSON</Label>
                        <Textarea
                          id="footer_involved_links_json"
                          rows={4}
                          value={content.footer_involved_links_json}
                          onChange={(e) => setContentField("footer_involved_links_json", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="social_links_json">Social links JSON</Label>
                        <Textarea
                          id="social_links_json"
                          rows={4}
                          value={content.social_links_json}
                          onChange={(e) => setContentField("social_links_json", e.target.value)}
                        />
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-semibold">Images and Logos</h2>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="logo_nav_url">Navbar logo URL</Label>
                          <Input
                            id="logo_nav_url"
                            value={content.logo_nav_url}
                            onChange={(e) => setContentField("logo_nav_url", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo_footer_url">Footer logo URL</Label>
                          <Input
                            id="logo_footer_url"
                            value={content.logo_footer_url}
                            onChange={(e) => setContentField("logo_footer_url", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo_partner_url">Partner logo URL</Label>
                          <Input
                            id="logo_partner_url"
                            value={content.logo_partner_url}
                            onChange={(e) => setContentField("logo_partner_url", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="footer_brand_text">Footer brand text</Label>
                        <Textarea
                          id="footer_brand_text"
                          rows={3}
                          value={content.footer_brand_text}
                          onChange={(e) => setContentField("footer_brand_text", e.target.value)}
                        />
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-semibold">Events List (JSON)</h2>
                      <p className="text-sm text-muted-foreground">
                        Edit full event objects here. Changes go live on the Events page after save.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="events_json">Events JSON</Label>
                        <Textarea
                          id="events_json"
                          rows={10}
                          value={content.events_json}
                          onChange={(e) => setContentField("events_json", e.target.value)}
                        />
                      </div>
                    </section>

                    <div className="pt-2">
                      <Button variant="hero" onClick={handleSaveContent} disabled={savingContent}>
                        <Save className="h-4 w-4" />
                        {savingContent ? "Saving..." : "Save CMS Changes"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
