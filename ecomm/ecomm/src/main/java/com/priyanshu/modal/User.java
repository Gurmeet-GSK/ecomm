
package com.priyanshu.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.priyanshu.domain.USER_ROLE;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String email;

    @Column(name = "full_name")
    private String fullName;

    private String mobile;

    @Enumerated(EnumType.ORDINAL)
    private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER;

    @OneToMany
    @JoinTable(
            name = "user_addresses",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "addresses_id")
    )
    private Set<Address> addresses = new HashSet<>();

    @ManyToMany
    @JsonIgnore
    @JoinTable(
            name = "user_used_coupons",
            joinColumns = @JoinColumn(name = "used_by_users_id"),
            inverseJoinColumns = @JoinColumn(name = "used_coupons_id")
    )
    private Set<Coupon> usedCoupons = new HashSet<>();
}
