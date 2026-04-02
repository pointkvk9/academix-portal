import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getGroupLabel, GROUPS } from "@/lib/groups";
import { Users, IndianRupee, BookOpen, TrendingUp, CheckCircle, Clock } from "lucide-react";

export function AnalyticsDashboard() {
  const [data, setData] = useState<{
    groupEnrollment: { group: string; count: number; label: string }[];
    groupRevenue: { group: string; revenue: number; label: string }[];
    statusBreakdown: { name: string; value: number }[];
    totalStudents: number;
    totalRevenue: number;
    totalSubmitted: number;
    totalPending: number;
  }>({
    groupEnrollment: [],
    groupRevenue: [],
    statusBreakdown: [],
    totalStudents: 0,
    totalRevenue: 0,
    totalSubmitted: 0,
    totalPending: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Fetch all exams
      const { data: exams } = await supabase.from("exams").select("id, class, fee_amount");
      // Fetch all applications
      const { data: apps } = await supabase.from("exam_applications").select("id, exam_id, is_submitted, fee_status");

      if (!exams || !apps) return;

      const examMap = new Map(exams.map(e => [e.id, e]));

      // Group enrollment
      const groupCounts: Record<string, number> = {};
      const groupRevenue: Record<string, number> = {};
      let totalSubmitted = 0;
      let totalPending = 0;
      let totalRevenue = 0;

      for (const app of apps) {
        const exam = examMap.get(app.exam_id);
        if (!exam) continue;
        const group = exam.class;
        groupCounts[group] = (groupCounts[group] || 0) + 1;

        if (app.fee_status === "paid") {
          const fee = Number(exam.fee_amount) || 0;
          groupRevenue[group] = (groupRevenue[group] || 0) + fee;
          totalRevenue += fee;
        }

        if (app.is_submitted) totalSubmitted++;
        else totalPending++;
      }

      setData({
        groupEnrollment: GROUPS.map(g => ({
          group: g.value,
          label: g.label,
          count: groupCounts[g.value] || 0,
        })),
        groupRevenue: GROUPS.map(g => ({
          group: g.value,
          label: g.label,
          revenue: groupRevenue[g.value] || 0,
        })),
        statusBreakdown: [
          { name: "Submitted", value: totalSubmitted },
          { name: "Pending", value: totalPending },
        ],
        totalStudents: apps.length,
        totalRevenue,
        totalSubmitted,
        totalPending,
      });
    };

    fetchAnalytics();
  }, []);

  const COLORS = ["hsl(142, 70%, 35%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)"];
  const PIE_COLORS = ["hsl(142, 70%, 35%)", "hsl(38, 92%, 50%)"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-primary" /> Analytics Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">Group-wise enrollment, revenue & application status overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 bg-primary/5">
            <Users className="h-6 w-6 text-primary mb-2" />
            <p className="text-2xl font-bold">{data.totalStudents}</p>
            <p className="text-xs text-muted-foreground">Total Enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-success/10">
            <IndianRupee className="h-6 w-6 text-success mb-2" />
            <p className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-info/10">
            <CheckCircle className="h-6 w-6 text-info mb-2" />
            <p className="text-2xl font-bold">{data.totalSubmitted}</p>
            <p className="text-xs text-muted-foreground">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-warning/10">
            <Clock className="h-6 w-6 text-accent mb-2" />
            <p className="text-2xl font-bold">{data.totalPending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group Enrollment Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Group-wise Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.groupEnrollment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(0, 75%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Group Revenue Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Group-wise Revenue (₹)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.groupRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(142, 70%, 35%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.statusBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {data.statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Group Details Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Group Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.groupEnrollment.map((g, i) => (
                <div key={g.group} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">{i + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{g.label}</p>
                      <p className="text-xs text-muted-foreground">{GROUPS[i]?.classes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{g.count} students</p>
                    <p className="text-xs text-success">₹{(data.groupRevenue[i]?.revenue || 0).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
