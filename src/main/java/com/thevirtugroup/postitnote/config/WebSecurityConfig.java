package com.thevirtugroup.postitnote.config;

import com.thevirtugroup.postitnote.repository.UserRepository;
import com.thevirtugroup.postitnote.security.CustomAuthenticationSuccessHandler;
import com.thevirtugroup.postitnote.security.JsonAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.encoding.PlaintextPasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserDetailsService userDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .addFilterBefore(authenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()
                .anyRequest().permitAll()
                .and()
                .logout()
                .logoutUrl("/api/logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                // .logoutSuccessUrl("/")
                .and()
                .csrf().disable()
                .httpBasic()
        ;
    }

    @Bean
    public JsonAuthenticationFilter authenticationFilter() throws Exception {
        JsonAuthenticationFilter authFilter = new JsonAuthenticationFilter();
        authFilter.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/api/login", "POST"));
        authFilter.setAuthenticationManager(authenticationManager());
        authFilter.setAuthenticationSuccessHandler(successHandler());
        authFilter.setUsernameParameter("username");
        authFilter.setPasswordParameter("password");
        return authFilter;
    }

    @Bean
    public CustomAuthenticationSuccessHandler successHandler() {
        return new CustomAuthenticationSuccessHandler();
    }


    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);

        auth
                .authenticationProvider(authenticationProvider)
                .userDetailsService(userDetailsService)
                .passwordEncoder(new PlaintextPasswordEncoder())
                .and();
    }

}
