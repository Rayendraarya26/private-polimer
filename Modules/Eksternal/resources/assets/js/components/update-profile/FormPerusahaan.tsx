import { memo, useMemo } from "react"
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap"
import useProfile from "../../hooks/useProfile"
import { Check, Download } from "react-feather"
import useEditProfilePerusahaan from "../../hooks/profile/useEditProfilePerusahaan"
import { PerusahaanBadanHukumType, PerusahaanJenisType } from "../../types/profile"
import styled from "styled-components"
import useRequestOTP from "../../hooks/useRequestOTP"
import { getPlainE164PhoneNumber } from "../../utils/common"
import { YesNoOption } from "../../types/core"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import 'react-phone-number-input/style.css'

const StyledRow = styled(Row)`
  gap: 1rem;
  @media screen and (min-width: 768px) {
    gap: 0;
  }
`

const FormPerusahaan: React.FC = () => {
  const { profile } = useProfile()
  const { rhf, errors, submitting, onSubmit } = useEditProfilePerusahaan()

  const { requesting, isRequested, getWhatsappOTP } = useRequestOTP()
  const isWhatsappChanged = useMemo<boolean>(() => {
    return getPlainE164PhoneNumber(rhf.getValues('pj_whatsapp')) !== getPlainE164PhoneNumber(profile?.detail?.pj_whatsapp || '')
  }, [rhf.watch('pj_whatsapp'), profile])

  return (
    <Form 
      className="w-100"
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <Row>
        <Col xs={12} lg={6} className="d-flex flex-column gap-5">
          <div className="w-100 d-flex flex-column gap-2">
            <div className="fs-5 fw-bold">Data Umum</div>
            <div className="w-100 d-flex flex-column gap-3 border rounded-3 p-3 bg-light">
              <Form.Group>
                <Form.Label>
                  Nama Perusahaan <span className="text-danger">*</span>
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
              <Form.Group>
                <Form.Label>
                  Alamat Perusahaan <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  isInvalid={!!errors?.alamat?.message}
                  {...rhf.register('alamat')}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.alamat?.message || ''}
                </div>
              </Form.Group>
              <StyledRow>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Badan Hukum <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      isInvalid={!!errors?.badan_hukum?.message}
                      {...rhf.register('badan_hukum')}
                    >
                      <option disabled>-- Pilih Badan Hukum --</option>
                      {Object.values(PerusahaanBadanHukumType).map(value => <option value={value} key={value}>{value}</option>)}
                    </Form.Select>
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.badan_hukum?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Jenis Perusahaan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      isInvalid={!!errors?.jenis?.message}
                      {...rhf.register('jenis')}
                    >
                      <option disabled>-- Pilih Jenis Perusahaan --</option>
                      {Object.values(PerusahaanJenisType).map(value => <option value={value} key={value}>{value}</option>)}
                    </Form.Select>
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.jenis?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
              </StyledRow>
              <StyledRow>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Nama Pemilik Perusahaan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="text"
                      isInvalid={!!errors?.pemilik?.message}
                      {...rhf.register('pemilik')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.pemilik?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Nama Pimpinan Perusahaan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="text"
                      isInvalid={!!errors?.pimpinan?.message}
                      {...rhf.register('pimpinan')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.pimpinan?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
              </StyledRow>
              <StyledRow>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Nomor Telepon Perusahaan <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>+62</InputGroup.Text>
                      <Form.Control 
                        type="number"
                        isInvalid={!!errors?.telepon?.message}
                        {...rhf.register('telepon')}
                      />
                    </InputGroup>
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.telepon?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Nomor Fax Perushaan <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="text"
                      isInvalid={!!errors?.fax?.message}
                      {...rhf.register('fax')}
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.fax?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
              </StyledRow>
              <StyledRow>
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Alamat Surel Perusahaan <span className="text-danger">*</span>
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
                <Col xs={12} lg={6}>
                  <Form.Group>
                    <Form.Label>
                      Nomor Whatsapp Perusahaan <span className="text-danger">*</span>
                    </Form.Label>
                    <PhoneInputWithCountrySelect
                      defaultCountry="ID"
                      placeholder="Masukkan nomor"
                      className="align-items-stretch"
                      value={rhf.watch('whatsapp')}
                      onChange={v => rhf.setValue('whatsapp', v)}
                    />
                    <div style={{ fontSize: '0.65rem' }}>
                      Pilih negara dan masukkan nomor anda. Contoh: Indonesia, 8123456789
                    </div>
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      {errors?.whatsapp?.message || ''}
                    </div>
                  </Form.Group>
                </Col>
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
              <Form.Group>
                <Form.Label>
                  Nomor Akta Pendirian
                </Form.Label>
                <Form.Control 
                  type="text"
                  isInvalid={!!errors?.no_akta_pendirian?.message}
                  {...rhf.register('no_akta_pendirian')}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.no_akta_pendirian?.message || ''}
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  IUP
                </Form.Label>
                <Form.Control 
                  type="text"
                  isInvalid={!!errors?.iup?.message}
                  {...rhf.register('iup')}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.iup?.message || ''}
                </div>
              </Form.Group>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={6} className="d-flex flex-column gap-5">
          <div className="w-100 d-flex flex-column gap-2">
            <div className="fs-5 fw-bold">Penanggung Jawab</div>
            <div className="w-100 d-flex flex-column gap-3 border rounded-3 p-3 bg-light">
              <Form.Group>
                <Form.Label>
                  Nama Penanggung Jawab <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control 
                  type="text"
                  isInvalid={!!errors?.pj_nama?.message}
                  {...rhf.register('pj_nama')}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.pj_nama?.message || ''}
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Alamat Surel <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control 
                  type="email"
                  isInvalid={!!errors?.pj_surel?.message}
                  {...rhf.register('pj_surel')}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.pj_surel?.message || ''}
                </div>
              </Form.Group>
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
                        value={rhf.watch('pj_whatsapp')}
                        onChange={v => rhf.setValue('pj_whatsapp', v)}
                      />
                      {isWhatsappChanged && !!rhf.watch('pj_whatsapp') && (
                        <InputGroup.Text 
                          as={Button}
                          variant="primary"
                          disabled={requesting}
                          onClick={() => getWhatsappOTP(rhf.getValues('pj_whatsapp'))}
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
                      {errors?.pj_whatsapp?.message || ''}
                    </div>
                    {!isRequested && !isWhatsappChanged && profile?.detail?.pj_whatsapp_verified === YesNoOption.YES && (
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
                        isInvalid={!!errors?.pj_whatsapp_otp?.message}
                        {...rhf.register('pj_whatsapp_otp')}
                      />
                      <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                        {errors?.pj_whatsapp_otp?.message || ''}
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </StyledRow>
            </div>
          </div>
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
              <Form.Group>
                <Form.Label className="w-100 w-100 d-flex justify-content-between">
                  <div>Akta Pendirian (Maksimal 5 MB)</div>
                  {profile?.detail?.dok_akta_pendirian && (
                    <a 
                      href={profile.detail.dok_akta_pendirian}
                      target="_blank"
                      style={{ fontSize: '0.75rem' }}
                      className="text-primary text-decoration-none fw-6 d-inline-flex align-items-center gap-2"
                    >
                      <Download size={16}/>
                      Unduh File Akta Pendirian Terakhir
                    </a>
                  )}
                </Form.Label>
                <Form.Control 
                  type="file"
                  accept=".pdf"
                  isInvalid={!!errors?.dok_akta_pendirian?.message}
                  onChange={e => rhf.setValue('dok_akta_pendirian', (e.target as HTMLInputElement).files?.[0] || null)}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.dok_akta_pendirian?.message || ''}
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label className="w-100 w-100 d-flex justify-content-between">
                  <div>IUP (Maksimal 5 MB)</div>
                  {profile?.detail?.dok_iup && (
                    <a 
                      href={profile.detail.dok_iup}
                      target="_blank"
                      style={{ fontSize: '0.75rem' }}
                      className="text-primary text-decoration-none fw-6 d-inline-flex align-items-center gap-2"
                    >
                      <Download size={16}/>
                      Unduh File IUP Terakhir
                    </a>
                  )}
                </Form.Label>
                <Form.Control 
                  type="file"
                  accept=".pdf"
                  isInvalid={!!errors?.dok_iup?.message}
                  onChange={e => rhf.setValue('dok_iup', (e.target as HTMLInputElement).files?.[0] || null)}
                />
                <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                  {errors?.dok_iup?.message || ''}
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
            disabled={submitting}
          >
            Simpan
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default memo(FormPerusahaan)