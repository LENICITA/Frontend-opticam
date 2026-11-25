// src/features/auth/pages/RestablecerContraseña.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthController } from '../../../core/controllers/AuthController';
import { alertError, alertSuccess, alertWarning } from '../../../shared/utils/alert';

export const RestablecerContraseña = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const authController = new AuthController();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tokenFromUrl) {
      void alertWarning('El enlace de recuperación no es válido. Solicita uno nuevo.');
      return;
    }
    if (newPassword.length < 8) {
      void alertWarning('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      void alertWarning('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const result = await authController.resetearPassword(tokenFromUrl, newPassword);
      if (result.success) {
        void alertSuccess('Contraseña actualizada exitosamente');
        void navigate('/login');
      } else {
        void alertError(result.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      void alertError(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenFromUrl) {
    return (
      <div className="min-h-[calc(100vh-94px)] bg-gray-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[500px] bg-white p-8 rounded-2xl shadow-lg text-center">
          <i className="fa-solid fa-circle-exclamation text-[#B90F0F] text-5xl mb-4"></i>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Enlace inválido</h2>
          <p className="text-sm text-gray-600 mb-6">
            Este enlace no contiene un token de recuperación válido. Solicita uno nuevo.
          </p>
          <Link
            to="/recuperar-contrasena"
            className="inline-block px-6 py-3 bg-[#B90F0F] text-white rounded-xl font-semibold hover:bg-red-800 transition"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-94px)] bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[500px]">
        <div className="bg-[#B90F0F] py-7 px-10 rounded-2xl flex flex-col items-center mb-6">
          <i className="fa-solid fa-key text-white text-5xl"></i>
          <h2 className="text-white text-[24px] font-bold mt-3 text-center">Nueva contraseña</h2>
        </div>

        <div className="bg-white w-full p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="Nueva-contrasena" className="block text-sm text-black mb-2 font-medium">
                Nueva contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white focus-within:border-[#B90F0F] transition">
                <input
                  id="Nueva-contrasena"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 px-4 py-3 text-base outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-500 hover:text-gray-700 transition"
                  aria-label="Mostrar contraseña"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xl`}></i>
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="confirmar-contrasena" className="block text-sm text-black mb-2 font-medium">
                Confirmar contraseña
              </label>
              <input
                id="confirmar-contrasena"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repite tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none focus:border-[#B90F0F] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-7 py-3.5 bg-[#B90F0F] text-white rounded-xl font-semibold hover:bg-red-800 transition disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Actualizar contraseña'
              )}
            </button>

            <Link
              to="/login"
              className="block text-center text-[#B90F0F] text-sm mt-5 underline hover:text-red-800"
            >
              ← Volver al inicio de sesión
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
