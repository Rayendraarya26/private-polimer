import { memo, useMemo } from "react"
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap"
import useProfile from "../../hooks/useProfile"
import useEditProfilePerorangan from "../../hooks/profile/useEditProfilePerorangan"
import { Check, Download } from "react-feather"
import styled from "styled-components"
import { PelangganGender } from "../../types/profile"
import { refEducations } from "../../constants/common"
import useRequestOTP from "../../hooks/useRequestOTP"
import { getPlainE164PhoneNumber } from "../../utils/common"
import { YesNoOption } from "../../types/core"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import 'react-phone-number-input/style.css'
import useRegions from "../../hooks/profile/useRegions"

const StyledRow = styled(Row)`
  gap: 1rem;
  @media screen and (min-width: 768px) {
    gap: 0;
  }
`

const FormPerorangan: React.FC = () => {
  const { profile } = useProfile()
  const { rhf, errors, submitting, onSubmit } = useEditProfilePerorangan()
  const { provinces, regencies, districts, loading } = useRegions(
    rhf.watch('prov_id'),
    rhf.watch('kab_id')
  )
  const watchAlamat = rhf.watch('alamat');
  const watchKecamatan = rhf.watch('kec_id');
  const isRegionLocked = !!watchAlamat && watchAlamat.trim().length > 0;
  const isAddressDisabled = !watchKecamatan;

  const { requesting, isRequested, getWhatsappOTP } = useRequestOTP()
  const isWhatsappChanged = useMemo<boolean>(() => {
    return getPlainE164PhoneNumber(rhf.getValues('whatsapp')) !== getPlainE164PhoneNumber(profile?.detail?.whatsapp || '')
  }, [rhf.watch('whatsapp'), profile])

  return (
    <Form 
      className="w-100"
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <Row>
        <Col xs={12} lg={7} className="d-flex flex-column gap-5">
          <div className="w-100 d-flex flex-column gap-2">
            <div className="fs-5 fw-bold">Data Umum</div>
            <div className="w-100 d-flex flex-column gap-3 border rounded-3 p-3 bg-light">
              <StyledRow>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Nama <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="text"
                      isInvalid={!!errors?.nama?.message}
                      {...rhf.register('nama')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.nama?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      NIK <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="number"
                      isInvalid={!!errors?.nik?.message}
                      {...rhf.register('nik')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.nik?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
              </StyledRow>
              {/* Baris Wilayah */}
              <StyledRow className="mb-3">
                <Col xs={12} lg={4}>
                  <Form.Group>
                    <Form.Label>Provinsi {loading && <Spinner size="sm" animation="border" />}</Form.Label>
                    <Form.Select 
                      {...rhf.register('prov_id')} 
                      isInvalid={!!errors.prov_id}
                      disabled={isRegionLocked} 
                      // TAMBAHKAN INI:
                      value={rhf.watch('prov_id') || ''} 
                      onChange={(e) => {
                        rhf.setValue('prov_id', e.target.value);
                        rhf.setValue('kab_id', '');
                        rhf.setValue('kec_id', '');
                        rhf.setValue('alamat', ''); 
                      }}
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinces.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} lg={4}>
                  <Form.Group>
                    <Form.Label>Kabupaten {loading && <Spinner size="sm" animation="border" />}</Form.Label>
                    <Form.Select 
                      {...rhf.register('kab_id')} 
                      isInvalid={!!errors.kab_id}
                      disabled={isRegionLocked || !rhf.watch('prov_id')}
                      // TAMBAHKAN INI:
                      value={rhf.watch('kab_id') || ''} 
                      onChange={(e) => {
                        rhf.setValue('kab_id', e.target.value);
                        rhf.setValue('kec_id', '');
                        rhf.setValue('alamat', ''); 
                      }}
                    >
                      <option value="">Pilih Kabupaten</option>
                      {regencies.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} lg={4}>
                  <Form.Group>
                    <Form.Label>Kecamatan {loading && <Spinner size="sm" animation="border" />}</Form.Label>
                    <Form.Select 
                      {...rhf.register('kec_id')} 
                      isInvalid={!!errors.kec_id}
                      disabled={isRegionLocked || !rhf.watch('kab_id')}
                      // TAMBAHKAN INI:
                      value={rhf.watch('kec_id') || ''} 
                      onChange={(e) => {
                        rhf.setValue('kec_id', e.target.value);
                        rhf.setValue('alamat', ''); 
                      }}
                    >
                      <option value="">Pilih Kecamatan</option>
                      {districts.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </StyledRow>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="mb-0">
                    Alamat (Jalan/No. Rumah) <span className="text-danger">*</span>
                  </Form.Label>
                  {isRegionLocked && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="py-0 px-2 d-flex align-items-center"
                      style={{ fontSize: '0.75rem', height: '24px', borderWidth: '1px' }}
                      onClick={() => {
                        rhf.setValue('alamat', '');
                        rhf.setValue('prov_id', '');
                        rhf.setValue('kab_id', '');
                        rhf.setValue('kec_id', '');
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Reset Alamat
                    </Button>
                  )}
                </div>
                <Form.Control 
                  as="textarea" 
                  {...rhf.register('alamat')} 
                  isInvalid={!!errors.alamat} 
                  disabled={isAddressDisabled}
                  placeholder={isAddressDisabled ? "Pilih wilayah terlebih dahulu..." : "Masukkan nama jalan dan nomor rumah"}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.alamat?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <StyledRow>
                <Col xs={12} lg={4}>
                  <Form.Group>
                    <Form.Label>
                      Tempat Lahir <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="text"
                      isInvalid={!!errors?.tempat_lahir?.message}
                      {...rhf.register('tempat_lahir')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.tempat_lahir?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={4}>
                  <Form.Group>
                    <Form.Label>
                      Tanggal Lahir <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="date"
                      isInvalid={!!errors?.tanggal_lahir?.message}
                      {...rhf.register('tanggal_lahir')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.tanggal_lahir?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={4}>
                  <Form.Group>
                    <Form.Label>
                      Jenis Kelamin <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      isInvalid={!!errors?.jenis_kelamin?.message}
                      {...rhf.register('jenis_kelamin')}
                    >
                      <option disabled>-- Pilih Jenis Kelamin --</option>
                      {Object.values(PelangganGender).map(value => <option value={value} key={value}>{value}</option>)}
                    </Form.Select>
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.jenis_kelamin?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
              </StyledRow>
              <StyledRow>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Kewarganegaraan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="text"
                      isInvalid={!!errors?.kewarganegaraan?.message}
                      {...rhf.register('kewarganegaraan')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.kewarganegaraan?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Alamat Surel <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="email"
                      isInvalid={!!errors?.surel?.message}
                      {...rhf.register('surel')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.surel?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
              </StyledRow>
              <StyledRow>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Pendidikan Terakhir <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      isInvalid={!!errors?.pendidikan_terakhir?.message}
                      {...rhf.register('pendidikan_terakhir')}
                    >
                      <option disabled>-- Pilih Pendidikan Terakhir --</option>
                      {refEducations.map(r => <option value={r.value} key={r.value}>{r.text}</option>)}
                    </Form.Select>
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.pendidikan_terakhir?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                {rhf.watch('pendidikan_terakhir') === 'OTHER' && (
                  <Col xs={12} lg={6}>
                    <Form.Group>
                      <Form.Label>
                        Pendidikan Lainnya <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control 
                        type="text"
                        isInvalid={!!errors?.pendidikan_lainnya?.message}
                        {...rhf.register('pendidikan_lainnya')}
                      />
                      <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                        {errors?.pendidikan_lainnya?.message || ''}
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </StyledRow>
              <StyledRow>
                <Col xs={12} xxl={7}>
                  <Form.Group>
                    <Form.Label>
                      Nomor Whatsapp <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup className="flex-nowrap">
                      <PhoneInputWithCountrySelect
                        defaultCountry="ID"
                        placeholder="Masukkan nomor"
                        className="align-items-stretch"
                        value={rhf.watch('whatsapp')}
                        onChange={v => rhf.setValue('whatsapp', v)}
                      />
                      {isWhatsappChanged && !!rhf.watch('whatsapp') && (
                        <InputGroup.Text 
                          as={Button}
                          variant="primary"
                          disabled={requesting}
                          onClick={() => getWhatsappOTP(rhf.getValues('whatsapp'))}
                        >
                          <div className="d-inline-flex align-items-center gap-2">
                            {requesting && <Spinner size="sm"/>}
                            <div>Request OTP</div>
                          </div>
                        </InputGroup.Text>
                      )}
                    </InputGroup>
                    <div style={{ fontSize: '0.65rem' }}>
                      Pilih negara dan masukkan nomor anda. Contoh: Indonesia, 8123456789
                    </div>
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.whatsapp?.message || ''}
                    </div>
                    {!isRequested && !isWhatsappChanged && profile?.detail?.whatsapp_verified === YesNoOption.YES && (
                      <span 
                        className="text-success"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <Check size={18}/>{' '}Telah terverifikasi
                      </span>
                    )}
                  </Form.Group>
                </Col>
                {isRequested && (
                  <Col xs={12} xxl={5}>
                    <Form.Group>
                      <Form.Label>
                        Kode OTP
                      </Form.Label>
                      <Form.Control 
                        type="text"
                        placeholder="Masukkan kode OTP"
                        isInvalid={!!errors?.whatsapp_otp?.message}
                        {...rhf.register('whatsapp_otp')}
                      />
                      <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                        {errors?.whatsapp_otp?.message || ''}
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </StyledRow>
            </div>
          </div>
          <div className="w-100 d-flex flex-column gap-2">
            <div className="fs-5 fw-bold">Data Perusahaan</div>
            <div className="w-100 d-flex flex-column gap-3 border rounded-3 p-3 bg-light">
              <Form.Group>
                <Form.Label>
                  NPWP <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  isInvalid={!!errors?.npwp?.message}
                  {...rhf.register('npwp')}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.npwp?.message || ''}
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Nomor Induk Berusaha <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  isInvalid={!!errors?.nib?.message}
                  {...rhf.register('nib')}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.nib?.message || ''}
                </div>
              </Form.Group>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={5} className="d-flex flex-column gap-5">
          <div className="w-100 d-flex flex-column gap-2">
            <div className="fs-5 fw-bold">Unggah Dokumen</div>
            <div className="w-100 d-flex flex-column gap-3 border rounded-3 p-3 bg-light">
              <Form.Group>
                <Form.Label className="w-100 d-flex justify-content-between">
                  <div>NPWP <span className="text-danger">*</span> (Maksimal 5 MB)</div>
                  {profile?.detail?.dok_npwp && (
                    <a 
                      href={profile.detail.dok_npwp}
                      target="_blank"
                      style={{ fontSize: '0.75rem' }}
                      className="text-primary text-decoration-none fw-6 d-inline-flex align-items-center gap-2"
                    >
                      <Download size={16}/>
                      Unduh File NPWP Terakhir
                    </a>
                  )}
                </Form.Label>
                <Form.Control 
                  type="file"
                  accept=".pdf"
                  isInvalid={!!errors?.dok_npwp?.message}
                  onChange={e => rhf.setValue('dok_npwp', (e.target as HTMLInputElement).files?.[0] || null)}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.dok_npwp?.message || ''}
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label className="w-100 w-100 d-flex justify-content-between">
                  <div>NIB <span className="text-danger">*</span> (Maksimal 5 MB)</div>
                  {profile?.detail?.dok_nib && (
                    <a 
                      href={profile.detail.dok_nib}
                      target="_blank"
                      style={{ fontSize: '0.75rem' }}
                      className="text-primary text-decoration-none fw-6 d-inline-flex align-items-center gap-2"
                    >
                      <Download size={16}/>
                      Unduh File NIB Terakhir
                    </a>
                  )}
                </Form.Label>
                <Form.Control 
                  type="file"
                  accept=".pdf"
                  isInvalid={!!errors?.dok_nib?.message}
                  onChange={e => rhf.setValue('dok_nib', (e.target as HTMLInputElement).files?.[0] || null)}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.dok_nib?.message || ''}
                </div>
              </Form.Group>
              {/* <Form.Group>
                <Form.Label className="w-100 w-100 d-flex justify-content-between">
                  <div>Lainnya (Maksimal 5 MB)</div>
                  {profile?.detail?.dok_lainnya && (
                    <a 
                      href={profile.detail.dok_lainnya}
                      target="_blank"
                      style={{ fontSize: '0.75rem' }}
                      className="text-primary text-decoration-none fw-6 d-inline-flex align-items-center gap-2"
                    >
                      <Download size={16}/>
                      Unduh File Lainnya Terakhir
                    </a>
                  )}
                </Form.Label>
                <Form.Control 
                  type="file"
                  accept=".pdf,.zip"
                  isInvalid={!!errors?.dok_lainnya?.message}
                  onChange={e => rhf.setValue('dok_lainnya', (e.target as HTMLInputElement).files?.[0] || null)}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.dok_lainnya?.message || ''}
                </div>
              </Form.Group> */}
            </div>
          </div>
        </Col>
        <Col xs={12} className="d-flex justify-content-end pt-4">
          <Button 
            type="submit"
            size="lg"
            disabled={submitting || requesting}
          >
            Simpan
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default memo(FormPerorangan)