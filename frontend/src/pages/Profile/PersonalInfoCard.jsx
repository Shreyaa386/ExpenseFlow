import { User, Mail, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function PersonalInfoCard({
  name,
  email,
  onChange,
  onSave,
  loading,
}) {
  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between h-full">
      <div>
        <CardHeader className="pb-3 border-b border-[#E8E7DE]">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your public profile name and system credentials</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <Input
            label="Full Name"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Enter your name"
            icon={User}
          />

          <Input
            label="Email Address"
            value={email}
            readOnly
            icon={Mail}
            helperText="Email cannot be changed directly for account security"
            className="cursor-not-allowed opacity-75"
          />
        </CardContent>
      </div>

      <div className="pt-4 border-t border-[#E8E7DE] flex justify-end">
        <Button
          onClick={onSave}
          loading={loading}
          className="w-full sm:w-auto px-6 h-11 shadow-sm"
        >
          <Save size={16} className="mr-2" />
          <span>Save Personal Information</span>
        </Button>
      </div>
    </Card>
  );
}

export default PersonalInfoCard;