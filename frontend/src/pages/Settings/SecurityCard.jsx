import { LockKeyhole, KeyRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function SecurityCard({
  passwords,
  onChange,
  onSave,
  loading,
}) {
  return (
    <Card className="p-5 sm:p-6">
      <CardHeader className="pb-4 border-b border-[#E8E7DE] dark:border-[#1E2D4A] mb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <LockKeyhole size={20} className="text-[#104E42] dark:text-[#00D09C]" />
            <span>Security & Authentication</span>
          </CardTitle>
          <CardDescription className="mt-1 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8]">
            Update your account password. Must be at least 8 characters with uppercase, lowercase, number, and symbol.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="!p-0">
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Current Password"
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={onChange}
              placeholder="Your existing password"
              icon={KeyRound}
              autoComplete="current-password"
            />

            <Input
              label="New Password"
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={onChange}
              placeholder="Min 8 chars with Aa, 1, @"
              icon={KeyRound}
              autoComplete="new-password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={onChange}
              placeholder="Re-enter new password"
              icon={KeyRound}
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E8E7DE] dark:border-[#1E2D4A]">
            <p className="text-xs text-[#66736E] dark:text-[#94A3B8]">
              For security, changing passwords will require your existing active password.
            </p>

            <Button
              type="submit"
              loading={loading}
              className="w-full sm:w-auto px-6 h-11 shadow-sm"
            >
              <span>Update Password</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default SecurityCard;