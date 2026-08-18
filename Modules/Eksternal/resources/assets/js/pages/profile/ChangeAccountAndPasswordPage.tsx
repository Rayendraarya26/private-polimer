import React, { memo, useCallback, useState } from "react"
import { User, Lock, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react"
import useChangePassword from "../../hooks/profile/useChangePassword"
import useChangeAccount from "../../hooks/profile/useChangeAccount"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"

const ChangeAccountAndPasswordPage: React.FC = () => {
  const {
    rhf: rhfAccount,
    errors: errorsAccount,
    submitting: submittingAccount,
    onSaveAccount,
  } = useChangeAccount()

  const {
    rhf,
    errors,
    submitting,
    onSavePassword,
  } = useChangePassword()

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({
    old_password: false,
    new_password: false,
    new_password_confirmation: false,
  })

  const togglePasswordVisibility = useCallback((key: string) => {
    setShowPassword((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Head title="Keamanan & Pengaturan Akun" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-600" />
          Pengaturan Akun & Keamanan
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Perbarui nama tampilan akun dan ganti kata sandi secara berkala untuk menjaga keamanan data perusahaan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ubah Nama Akun */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Nama Tampilan Akun</CardTitle>
              <CardDescription>Ubah nama identitas akun pengguna utama</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSaveAccount} className="space-y-4">
              <Input
                label="Nama Akun"
                placeholder="Masukkan nama akun..."
                leftIcon={<User className="w-4 h-4" />}
                disabled={submittingAccount}
                error={errorsAccount?.name?.message}
                required
                {...rhfAccount.register("name")}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={submittingAccount}
                >
                  Simpan Perubahan Nama
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Ubah Kata Sandi */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Ganti Kata Sandi</CardTitle>
              <CardDescription>Gunakan kombinasi minimal 8 karakter huruf dan angka</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSavePassword} className="space-y-4">
              {/* Password Lama */}
              <Input
                label="Kata Sandi Saat Ini"
                type={showPassword.old_password ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old_password")}
                    className="focus:outline-none hover:text-slate-700"
                  >
                    {showPassword.old_password ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                disabled={submitting}
                error={errors?.old_password?.message}
                {...rhf.register("old_password")}
              />

              {/* Password Baru */}
              <Input
                label="Kata Sandi Baru"
                type={showPassword.new_password ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<KeyRound className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new_password")}
                    className="focus:outline-none hover:text-slate-700"
                  >
                    {showPassword.new_password ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                disabled={submitting}
                error={errors?.new_password?.message}
                {...rhf.register("new_password")}
              />

              {/* Konfirmasi Password Baru */}
              <Input
                label="Konfirmasi Kata Sandi Baru"
                type={showPassword.new_password_confirmation ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<KeyRound className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new_password_confirmation")}
                    className="focus:outline-none hover:text-slate-700"
                  >
                    {showPassword.new_password_confirmation ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                disabled={submitting}
                error={errors?.new_password_confirmation?.message}
                {...rhf.register("new_password_confirmation")}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={submitting}
                >
                  Perbarui Kata Sandi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default memo(ChangeAccountAndPasswordPage)