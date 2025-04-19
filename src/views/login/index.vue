<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <div class="login-avatar">
          <img :src="getImageUrl('avatar.jpg')" alt="avatar" class="avatar-img">
        </div>
        <h2 class="login-title">
          欢迎回来
        </h2>
      </div>

      <div class="login-form-box">
        <van-form @submit="handleLogin">
          <van-cell-group inset>
            <van-field
              v-model="loginForm.username"
              class="username-field"
              name="username"
              placeholder="请输入用户名"
              autocomplete="off"
              :rules="usernameRules"
            >
              <template #left-icon>
                <van-icon name="user" class="field-icon" />
              </template>
            </van-field>
            <van-field
              v-model="loginForm.password"
              class="password-field"
              type="password"
              name="password"
              placeholder="请输入密码"
              :rules="passwordRules"
            >
              <template #left-icon>
                <van-icon name="lock" class="field-icon" />
              </template>
            </van-field>
          </van-cell-group>

          <div class="login-btn-wrap">
            <van-button
              round
              block
              type="primary"
              native-type="submit"
              :loading="loading"
              class="login-btn"
            >
              进入系统 ʕ •ᴥ•ʔ
            </van-button>
            <div class="register-link">
              没有账号？
              <router-link replace to="/register" class="link">
                去注册
              </router-link>
            </div>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FieldRule } from 'vant'
import { useAuthStore } from '@/store/auth'
import { getImageUrl } from '@/utils/common'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
})

const usernameRules: FieldRule[] = [
  { required: true, message: '请输入用户名' },
  { pattern: /^[a-z0-9]{6,20}$/i, message: '用户名只能包含英文和数字，长度6-20位' },
]

const passwordRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /^.{6,20}$/, message: '密码长度在6-20位之间' },
]

async function handleLogin() {
  loading.value = true
  try {
    const success = await authStore.loginAction(loginForm)
    if (success) {
      const redirect = route.query.redirect as string
      router.replace(redirect || '/')
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  min-height: 100%;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
}

.login-content {
  flex: 1;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.login-header {
  padding: 10% 0 8%;
  text-align: center;
  flex-shrink: 1;
}

.login-avatar {
  width: 110px;
  height: 110px;
  margin: 0 auto 20px;
  background: #fff;
  border-radius: 55px;
  padding: 4px;
  box-shadow: 0 8px 20px rgba(64, 128, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.login-title {
  font-size: 32px;
  color: #4a90e2;
  margin: 0;
  font-weight: 600;
}

.login-subtitle {
  font-size: 16px;
  color: #8b8b8b;
  margin: 12px 0 0;
}

.login-form-box {
  margin-top: 20px;
  flex-shrink: 0;
}

:deep(.van-cell-group--inset) {
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(64, 128, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

:deep(.van-field) {
  padding: 14px 16px;

  .van-field__left-icon {
    margin-right: 12px;
    font-size: 20px;
    color: #4a90e2;
    transition: transform 0.3s;
  }

  &:focus-within {
    .van-field__left-icon {
      transform: scale(1.1);
    }
  }

  .van-field__control {
    font-size: 16px;
    color: #333;

    &::placeholder {
      color: #bbb;
      font-size: 16px;
    }
  }
}

.username-field {
  margin-bottom: 10px;
}

.password-field {
  margin-top: 10px;
}

.login-btn-wrap {
  margin-top: 28px;
  padding: 0 12px;
}

.login-btn {
  height: 46px;
  font-size: 18px;
  font-weight: 500;
  background: linear-gradient(135deg, #4a90e2 0%, #2b6cb0 100%);
  border: none;
  border-radius: 23px;
  box-shadow: 0 8px 15px rgba(64, 128, 255, 0.2);
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 4px 8px rgba(64, 128, 255, 0.2);
  }
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #666;

  .link {
    color: #4a90e2;
    text-decoration: none;
    margin-left: 4px;

    &:active {
      opacity: 0.8;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

// 当键盘弹出时应用的样式
@media screen and (max-height: 480px) {
  .login-header {
    padding: 5% 0 4%;
  }

  .login-avatar {
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
    padding: 5px;
    animation: none;
  }

  .login-title {
    font-size: 24px;
  }

  .login-form-box {
    margin-top: 10px;
  }

  .login-btn-wrap {
    margin-top: 20px;
  }

  .login-btn {
    height: 42px;
    font-size: 16px;
  }
}
</style>
