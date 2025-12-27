import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, Clock, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function ContactPage() {
  const { t } = useTranslation("static");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success(t("contact.form.success"));

    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t("contact.info.email"),
      value: t("contact.info.emailValue"),
    },
    {
      icon: Phone,
      label: t("contact.info.phone"),
      value: t("contact.info.phoneValue"),
    },
    {
      icon: Clock,
      label: t("contact.info.hours"),
      value: t("contact.info.hoursValue"),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("contact.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("contact.subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-5">
        {/* Form */}
        <div className="md:col-span-3">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">{t("contact.form.name")}</Label>
                    <Input
                      id="name"
                      required
                      placeholder={t("contact.form.namePlaceholder")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("contact.form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder={t("contact.form.emailPlaceholder")}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                  <Input
                    id="subject"
                    required
                    placeholder={t("contact.form.subjectPlaceholder")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message">{t("contact.form.message")}</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    placeholder={t("contact.form.messagePlaceholder")}
                    className="mt-1 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="mr-2 animate-spin" />
                      {t("contact.form.sending")}
                    </>
                  ) : (
                    <>
                      <Send size={14} className="mr-2" />
                      {t("contact.form.submit")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("contact.info.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm">{value}</p>
                  </div>
                </div>
              ))}

              {/* Address */}
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("contact.info.address")}
                  </p>
                  <p className="whitespace-pre-line text-sm">
                    {t("contact.info.addressValue")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
