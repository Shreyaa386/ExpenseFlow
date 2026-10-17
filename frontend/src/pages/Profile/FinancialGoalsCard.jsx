import { DollarSign, Target, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function FinancialGoalsCard({
  monthlyIncome,
  monthlySavingGoal,
  onChange,
  onSave,
  loading,
}) {
  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between h-full">
      <div>
        <CardHeader className="pb-3 border-b border-[#E8E7DE]">
          <div>
            <CardTitle>Financial Targets</CardTitle>
            <CardDescription>Benchmark targets used for dashboard progress and budgets</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <Input
            label="Monthly Income Target"
            type="number"
            name="monthlyIncome"
            value={monthlyIncome}
            onChange={onChange}
            placeholder="e.g. 50000"
            icon={DollarSign}
            helperText="Estimated regular monthly income inflow"
          />

          <Input
            label="Monthly Savings Target"
            type="number"
            name="monthlySavingGoal"
            value={monthlySavingGoal}
            onChange={onChange}
            placeholder="e.g. 15000"
            icon={Target}
            helperText="Monthly net savings goal"
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
          <span>Save Financial Targets</span>
        </Button>
      </div>
    </Card>
  );
}

export default FinancialGoalsCard;